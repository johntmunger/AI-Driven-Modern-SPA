<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import type { Ingredient, Recipe } from "./types/ingredient";
import { Icon } from "@iconify/vue";
import IngredientInput from "./components/IngredientInput.vue";
import IngredientList from "./components/IngredientList.vue";
import SaveRecipeModal from "./components/SaveRecipeModal.vue";
import CurrentRecipeDisplay from "./components/CurrentRecipeDisplay.vue";
import DeleteConfirmModal from "./components/DeleteConfirmModal.vue";
import * as api from "./services/api";

// Background images - bright kitchen/restaurant themed for light mode
const backgroundImages = [
  "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1920&q=80", // Bright modern kitchen with natural light
  "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=1920&q=80", // Light airy restaurant interior
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80", // Bright white kitchen counter
  "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=1920&q=80", // Fresh produce and bright kitchen
  "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=1920&q=80", // Bright food prep area with ingredients
  "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=1920&q=80", // Bright chef's kitchen workspace
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1920&q=80", // Fresh vegetables and bright countertop
  "https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=1920&q=80", // Sunlit kitchen with wood accents
  "https://images.unsplash.com/photo-1505935428862-770b6f24f629?w=1920&q=80", // Minimal white plate with fresh ingredients
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1920&q=80", // Simple dish on white background
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1920&q=80", // Minimal salad ingredients on white surface
];

const ingredients = ref<Ingredient[]>([]);
const recipes = ref<Recipe[]>([]);
const currentRecipe = ref<Recipe | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);
const showSaveModal = ref(false);
const showDeleteConfirm = ref(false);
const showRecipesDropdown = ref(false);
const currentBackground = ref("");
const hasUserInteracted = ref(false);

// Select random background on mount
onMounted(async () => {
  currentBackground.value = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
  await Promise.all([loadIngredients(), loadRecipes()]);

  // Close dropdown when clicking outside
  document.addEventListener("click", handleClickOutside);
});

// Close dropdown when clicking outside
const handleClickOutside = (event: any) => {
  const target = event.target;
  // Check if click is outside the dropdown button and menu
  if (!target.closest(".recipes-dropdown-container")) {
    showRecipesDropdown.value = false;
  }
};

// Cleanup event listener on unmount
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const loadIngredients = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    ingredients.value = await api.fetchIngredients();
  } catch (err) {
    error.value = err instanceof api.ApiError ? err.message : "Failed to load ingredients";
    console.error("Error loading ingredients:", err);
  } finally {
    isLoading.value = false;
  }
};

const loadRecipes = async () => {
  error.value = null;
  try {
    recipes.value = await api.fetchRecipes();
  } catch (err) {
    error.value = err instanceof api.ApiError ? err.message : "Failed to load recipes";
    console.error("Error loading recipes:", err);
  }
};

const addIngredient = async (name: string) => {
  hasUserInteracted.value = true;
  error.value = null;

  // Capitalize first letter of first word
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

  try {
    const newIngredient = await api.createIngredient(capitalizedName);
    ingredients.value.unshift(newIngredient);
  } catch (err) {
    error.value = err instanceof api.ApiError ? err.message : "Failed to add ingredient";
    console.error("Error adding ingredient:", err);
    throw err;
  }
};

const updateIngredient = async (id: number, name: string) => {
  hasUserInteracted.value = true;
  const ingredient = ingredients.value.find((i) => i.id === id);
  if (!ingredient) return;

  const previousName = ingredient.name;
  ingredient.name = name;

  error.value = null;
  try {
    await api.updateIngredient(id, name);
  } catch (err) {
    ingredient.name = previousName;
    error.value = err instanceof api.ApiError ? err.message : "Failed to update ingredient";
    console.error("Error updating ingredient:", err);
  }
};

const deleteIngredient = async (id: number) => {
  hasUserInteracted.value = true;
  const ingredientIndex = ingredients.value.findIndex((i) => i.id === id);
  if (ingredientIndex === -1) return;

  const deletedIngredient = ingredients.value[ingredientIndex];
  ingredients.value.splice(ingredientIndex, 1);

  error.value = null;
  try {
    await api.deleteIngredient(id);
  } catch (err) {
    ingredients.value.splice(ingredientIndex, 0, deletedIngredient);
    error.value = err instanceof api.ApiError ? err.message : "Failed to delete ingredient";
    console.error("Error deleting ingredient:", err);
  }
};

const openSaveModal = () => {
  if (ingredients.value.length > 0) {
    showSaveModal.value = true;
  }
};

const saveRecipe = async (recipeName: string) => {
  error.value = null;
  try {
    const ingredientNames = ingredients.value.map((i) => i.name);
    const newRecipe = await api.createRecipe(recipeName, ingredientNames);

    // Update recipes list
    recipes.value.unshift(newRecipe);

    // Set as current recipe (will show with edit/delete options)
    currentRecipe.value = newRecipe;

    // Close modal
    showSaveModal.value = false;

    // Keep ingredients displayed so user can see the saved recipe
    // Don't clear them - they can manually add more or delete items
    hasUserInteracted.value = false; // Reset interaction flag to hide warnings
  } catch (err) {
    error.value = err instanceof api.ApiError ? err.message : "Failed to save recipe";
    console.error("Error saving recipe:", err);
  }
};

const loadRecipeIngredients = async (recipe: Recipe) => {
  error.value = null;
  try {
    // Clear current ingredients
    for (const ingredient of ingredients.value) {
      await api.deleteIngredient(ingredient.id);
    }
    ingredients.value = [];

    // Add recipe ingredients
    for (const ingredientName of recipe.ingredients) {
      const newIngredient = await api.createIngredient(ingredientName);
      ingredients.value.push(newIngredient);
    }

    // Set current recipe
    currentRecipe.value = recipe;
  } catch (err) {
    error.value = err instanceof api.ApiError ? err.message : "Failed to load recipe";
    console.error("Error loading recipe:", err);
  }
};

const updateRecipeName = async (newName: string) => {
  if (!currentRecipe.value) return;

  error.value = null;
  try {
    // Update recipe in the database (we'll need to add this endpoint)
    const updatedRecipe = await api.updateRecipe(currentRecipe.value.id, newName);
    currentRecipe.value = updatedRecipe;

    // Update in recipes list
    const index = recipes.value.findIndex((r) => r.id === currentRecipe.value!.id);
    if (index !== -1) {
      recipes.value[index] = updatedRecipe;
    }
  } catch (err) {
    error.value = err instanceof api.ApiError ? err.message : "Failed to update recipe name";
    console.error("Error updating recipe:", err);
  }
};

const confirmDeleteRecipe = () => {
  showDeleteConfirm.value = true;
};

const deleteCurrentRecipe = async () => {
  if (!currentRecipe.value) return;

  error.value = null;
  try {
    await api.deleteRecipe(currentRecipe.value.id);

    // Remove from recipes list
    recipes.value = recipes.value.filter((r) => r.id !== currentRecipe.value!.id);

    // Clear current recipe
    currentRecipe.value = null;
    showDeleteConfirm.value = false;

    // Clear current ingredients
    for (const ingredient of ingredients.value) {
      await api.deleteIngredient(ingredient.id);
    }
    ingredients.value = [];
  } catch (err) {
    error.value = err instanceof api.ApiError ? err.message : "Failed to delete recipe";
    console.error("Error deleting recipe:", err);
  }
};

const ingredientCount = computed(() => ingredients.value.length);
const recipeCount = computed(() => recipes.value.length);

// Find matching recipe based on current ingredients
const matchingRecipe = computed(() => {
  if (ingredients.value.length === 0) return null;

  const currentIngredientNames = ingredients.value.map((i) => i.name.toLowerCase().trim()).sort();

  return recipes.value.find((recipe) => {
    const recipeIngredientNames = recipe.ingredients.map((i) => i.toLowerCase().trim()).sort();

    if (currentIngredientNames.length !== recipeIngredientNames.length) return false;

    return currentIngredientNames.every((name, index) => name === recipeIngredientNames[index]);
  });
});

const currentRecipeName = computed(() => {
  // If manually set current recipe, use that
  if (currentRecipe.value) return currentRecipe.value.name;
  // Otherwise check if ingredients match any saved recipe
  if (matchingRecipe.value) return matchingRecipe.value.name;
  // Default
  return "Example Recipe";
});

const currentRecipeId = computed(() => {
  if (currentRecipe.value) return currentRecipe.value.id;
  if (matchingRecipe.value) return matchingRecipe.value.id;
  return null;
});

// No default ingredients anymore - always allow saving

// Check if current ingredients match any existing recipe
const isDuplicateRecipe = computed(() => {
  if (ingredients.value.length === 0) return false;

  const currentIngredientNames = ingredients.value.map((i) => i.name.toLowerCase().trim()).sort();

  return recipes.value.some((recipe) => {
    const recipeIngredientNames = recipe.ingredients.map((i) => i.toLowerCase().trim()).sort();

    if (currentIngredientNames.length !== recipeIngredientNames.length) return false;

    return currentIngredientNames.every((name, index) => name === recipeIngredientNames[index]);
  });
});

// Disable save button only if duplicate
const canSaveRecipe = computed(() => {
  return ingredientCount.value > 0 && !isDuplicateRecipe.value;
});

// Watch for matching recipe and set it as current
watch(
  [ingredients, recipes],
  () => {
    // Only auto-set if no manual recipe selection
    if (!currentRecipe.value && matchingRecipe.value) {
      currentRecipe.value = matchingRecipe.value;
    }
  },
  { immediate: true }
);

const dismissError = () => {
  error.value = null;
};
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden"
  >
    <!-- Background Image - No Transparency -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute inset-0 bg-cover bg-center bg-no-repeat"
        :style="{ backgroundImage: `url(${currentBackground})` }"
      ></div>
      <!-- Gradient overlay for header readability only - fades to transparent -->
      <div
        class="absolute inset-0 bg-gradient-to-b from-white via-white/30 to-transparent"
        style="
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.95) 0%,
            rgba(255, 255, 255, 0.75) 10%,
            rgba(255, 255, 255, 0.4) 25%,
            rgba(255, 255, 255, 0) 50%
          );
        "
      ></div>
    </div>

    <div class="relative z-10 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <header class="mb-6 sm:mb-10">
          <div class="flex items-start gap-3 sm:gap-4">
            <!-- Shopping Basket Logo SVG with Circle Border -->
            <div class="relative flex-shrink-0">
              <div
                class="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 border-green-700 bg-white/40 backdrop-blur-sm flex items-center justify-center p-2"
              >
                <svg
                  class="w-full h-full text-green-800"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style="
                    filter: drop-shadow(0 1px 3px rgba(255, 255, 255, 0.5))
                      drop-shadow(0 2px 6px rgba(255, 255, 255, 0.3));
                  "
                >
                  <!-- Basket handle -->
                  <path
                    d="M20 18C20 18 20 10 32 10C44 10 44 18 44 18"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    fill="none"
                  />

                  <!-- Basket body -->
                  <path
                    d="M12 24L16 52C16 54 18 56 20 56H44C46 56 48 54 48 52L52 24H12Z"
                    fill="currentColor"
                    opacity="0.9"
                  />

                  <!-- Basket top rim -->
                  <rect x="10" y="22" width="44" height="4" rx="1" fill="currentColor" />

                  <!-- Basket weave lines -->
                  <line
                    x1="20"
                    y1="28"
                    x2="18"
                    y2="52"
                    stroke="white"
                    stroke-width="1.5"
                    opacity="0.3"
                  />
                  <line
                    x1="28"
                    y1="28"
                    x2="26"
                    y2="52"
                    stroke="white"
                    stroke-width="1.5"
                    opacity="0.3"
                  />
                  <line
                    x1="36"
                    y1="28"
                    x2="38"
                    y2="52"
                    stroke="white"
                    stroke-width="1.5"
                    opacity="0.3"
                  />
                  <line
                    x1="44"
                    y1="28"
                    x2="46"
                    y2="52"
                    stroke="white"
                    stroke-width="1.5"
                    opacity="0.3"
                  />

                  <!-- Vegetables in basket -->
                  <!-- Tomato -->
                  <circle cx="24" cy="38" r="5" fill="#ef4444" opacity="0.8" />
                  <path
                    d="M24 33L24 35"
                    stroke="#22c55e"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />

                  <!-- Lettuce/Leafy green -->
                  <ellipse cx="38" cy="36" rx="6" ry="5" fill="#22c55e" opacity="0.7" />
                  <path
                    d="M35 34C36 32 40 32 41 34"
                    stroke="#16a34a"
                    stroke-width="1"
                    fill="none"
                  />

                  <!-- Carrot -->
                  <path
                    d="M32 44L32 50"
                    stroke="#f97316"
                    stroke-width="3"
                    stroke-linecap="round"
                    opacity="0.8"
                  />
                  <path d="M32 43L31 41L33 41Z" fill="#22c55e" opacity="0.6" />
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <h1
                class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-800 whitespace-nowrap"
                style="
                  text-shadow:
                    0 1px 3px rgba(255, 255, 255, 0.5),
                    0 2px 6px rgba(255, 255, 255, 0.3);
                "
              >
                Fresh & Fast Finds
              </h1>
              <p
                class="text-green-800 text-sm sm:text-base md:text-lg lg:text-xl flex items-center gap-2 font-medium whitespace-nowrap mt-1"
                style="
                  text-shadow:
                    0 1px 3px rgba(255, 255, 255, 0.5),
                    0 2px 6px rgba(255, 255, 255, 0.3);
                "
              >
                <Icon
                  icon="mdi:silverware-fork-knife"
                  class="text-base sm:text-lg md:text-xl lg:text-2xl"
                />
                <span>Shop, prep and cook!</span>
              </p>
            </div>
          </div>
        </header>

        <!-- Error Message -->
        <div
          v-if="error"
          class="mb-4 p-4 bg-red-50 border border-red-300 rounded-xl backdrop-blur-sm animate-slide-in-down shadow-lg"
        >
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <Icon icon="mdi:alert-circle" class="text-red-600 text-xl" />
              <span class="text-red-700 text-sm">{{ error }}</span>
            </div>
            <button
              class="text-red-600 hover:text-red-700 transition-colors"
              aria-label="Dismiss error"
              @click="dismissError"
            >
              <Icon icon="mdi:close" class="text-xl" />
            </button>
          </div>
        </div>

        <!-- Main card -->
        <div
          style="opacity: 0.95"
          class="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden animate-scale-in"
        >
          <div class="relative p-4 sm:p-6 md:p-8">
            <!-- Loading State -->
            <div v-if="isLoading" class="text-center py-12">
              <Icon icon="mdi:loading" class="text-6xl text-green-600 animate-spin mx-auto mb-4" />
              <p class="text-gray-600">Loading ingredients...</p>
            </div>

            <!-- Content -->
            <template v-else>
              <IngredientInput
                :auto-focus="ingredients.length === 0 && recipes.length === 0"
                @add-ingredient="addIngredient"
              />

              <!-- Recipe Action Buttons (no stats) -->
              <div v-if="ingredients.length > 0 || recipes.length > 0" class="mb-6 sm:mb-8">
                <div class="flex flex-col gap-2">
                  <div class="flex gap-2">
                    <button
                      class="px-3 py-2 sm:px-6 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-300 font-semibold flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm border bg-gradient-to-r from-green-600 to-emerald-600 text-white border-green-500 hover:from-green-700 hover:to-emerald-700 hover:scale-105 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      :disabled="!canSaveRecipe"
                      :title="
                        isDuplicateRecipe
                          ? 'Recipe with these ingredients already exists'
                          : 'Save current ingredients as a recipe'
                      "
                      @click="openSaveModal"
                    >
                      <Icon icon="mdi:content-save" class="text-base sm:text-xl flex-shrink-0" />
                      <span>Save Recipe</span>
                    </button>

                    <!-- Saved Recipes Dropdown -->
                    <div class="relative recipes-dropdown-container">
                      <button
                        class="px-3 py-2 sm:px-6 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-300 font-semibold flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm border text-gray-700 bg-white/70 border-gray-300 hover:bg-white hover:border-gray-400 hover:text-gray-900 hover:scale-105 whitespace-nowrap"
                        @click="showRecipesDropdown = !showRecipesDropdown"
                      >
                        <Icon
                          icon="mdi:book-open-variant"
                          class="text-base sm:text-xl flex-shrink-0"
                        />
                        <span>Saved Recipes</span>
                        <Icon
                          icon="mdi:chevron-down"
                          class="text-base sm:text-xl transition-transform duration-300 flex-shrink-0"
                          :class="{ 'rotate-180': showRecipesDropdown }"
                        />
                      </button>

                      <!-- Dropdown Menu -->
                      <Transition name="dropdown">
                        <div
                          v-if="showRecipesDropdown && recipes.length > 0"
                          class="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-10 max-h-80 overflow-y-auto"
                        >
                          <button
                            v-for="recipe in recipes"
                            :key="recipe.id"
                            class="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                            @click="
                              loadRecipeIngredients(recipe);
                              showRecipesDropdown = false;
                            "
                          >
                            <Icon
                              icon="mdi:chef-hat"
                              class="text-xl text-green-600 flex-shrink-0"
                            />
                            <div class="flex-1 min-w-0">
                              <div class="text-sm font-semibold text-gray-900 truncate">
                                {{ recipe.name }}
                              </div>
                              <div class="text-xs text-gray-600">
                                {{ recipe.ingredients.length }}
                                {{ recipe.ingredients.length === 1 ? "ingredient" : "ingredients" }}
                              </div>
                            </div>
                          </button>
                        </div>
                        <div
                          v-else-if="showRecipesDropdown && recipes.length === 0"
                          class="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 z-10"
                        >
                          <p class="text-sm text-gray-600 text-center">No saved recipes yet</p>
                        </div>
                      </Transition>
                    </div>
                  </div>

                  <!-- Warning messages - Only show after user interaction -->
                  <div
                    v-if="hasUserInteracted && isDuplicateRecipe"
                    class="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg"
                  >
                    <Icon icon="mdi:information" class="text-amber-600 text-base flex-shrink-0" />
                    <span class="text-xs text-amber-700"
                      >A recipe with these ingredients already exists</span
                    >
                  </div>
                </div>
              </div>

              <!-- Current Recipe Display - Only show when there's a saved recipe match -->
              <CurrentRecipeDisplay
                v-if="ingredients.length > 0 && (currentRecipe || matchingRecipe)"
                :recipe-name="currentRecipeName"
                :recipe-id="currentRecipeId"
                @update-name="updateRecipeName"
                @delete-recipe="confirmDeleteRecipe"
              />

              <IngredientList
                :ingredients="ingredients"
                @update="updateIngredient"
                @delete="deleteIngredient"
              />

              <!-- Stats at bottom -->
              <div
                v-if="ingredients.length > 0 || recipes.length > 0"
                class="pt-4 sm:pt-6 border-t border-gray-200"
              >
                <div class="flex items-center justify-between px-2 text-xs sm:text-sm">
                  <div class="flex items-center gap-2 group">
                    <div class="relative">
                      <Icon
                        icon="mdi:shopping"
                        class="text-base sm:text-lg text-green-600 group-hover:scale-110 transition-transform duration-300"
                      />
                      <div
                        class="absolute inset-0 blur-md bg-green-600/10 group-hover:bg-green-600/20 transition-all duration-300"
                      ></div>
                    </div>
                    <span
                      class="font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300"
                    >
                      <span class="text-green-600 text-base sm:text-lg">{{ ingredientCount }}</span>
                      <span class="hidden sm:inline ml-1">
                        {{ ingredientCount === 1 ? "ingredient" : "ingredients" }}
                      </span>
                      <span class="sm:hidden ml-1">items</span>
                    </span>
                  </div>

                  <div class="flex items-center gap-2 group">
                    <span
                      class="font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300"
                    >
                      <span class="text-emerald-600 text-base sm:text-lg">{{ recipeCount }}</span>
                      <span class="hidden sm:inline ml-1">
                        {{ recipeCount === 1 ? "recipe saved" : "recipes saved" }}
                      </span>
                      <span class="sm:hidden ml-1">saved</span>
                    </span>
                    <div class="relative">
                      <Icon
                        icon="mdi:chef-hat"
                        class="text-base sm:text-lg text-emerald-600 group-hover:scale-110 transition-transform duration-300"
                      />
                      <div
                        class="absolute inset-0 blur-md bg-emerald-600/10 group-hover:bg-emerald-600/20 transition-all duration-300"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Recipe Modal -->
    <SaveRecipeModal
      :is-open="showSaveModal"
      :ingredients="ingredients.map((i) => i.name)"
      @close="showSaveModal = false"
      @save="saveRecipe"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmModal
      :is-open="showDeleteConfirm"
      :recipe-name="currentRecipeName"
      @close="showDeleteConfirm = false"
      @confirm="deleteCurrentRecipe"
    />
  </div>
</template>

<style>
/* Dropdown animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
