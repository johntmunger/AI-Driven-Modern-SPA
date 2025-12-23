<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Icon } from "@iconify/vue";

interface Props {
  isOpen: boolean;
  ingredients: string[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  save: [recipeName: string];
}>();

const recipeName = ref("");

const handleSave = () => {
  if (recipeName.value.trim()) {
    emit("save", recipeName.value.trim());
    recipeName.value = "";
  }
};

const handleClose = () => {
  recipeName.value = "";
  emit("close");
};

// Handle Escape key
const handleEscape = (event: any) => {
  if (event.key === "Escape" && props.isOpen) {
    handleClose();
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleEscape);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleEscape);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        @click.self="handleClose"
      >
        <div
          class="bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in"
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50"
          >
            <div class="flex items-center gap-3">
              <Icon icon="mdi:chef-hat" class="text-4xl text-green-600" />
              <h2 class="text-2xl font-bold text-gray-900">Save Your Recipe</h2>
            </div>
            <button
              class="text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Close modal"
              @click="handleClose"
            >
              <Icon icon="mdi:close" class="text-2xl" />
            </button>
          </div>

          <!-- Content -->
          <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <!-- Recipe Name Input -->
            <div class="mb-6">
              <label for="recipeName" class="block text-sm font-semibold text-gray-700 mb-2">
                Recipe Name
              </label>
              <input
                id="recipeName"
                v-model="recipeName"
                type="text"
                placeholder="e.g., Grandma's Special Pasta"
                class="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 placeholder-gray-400"
                @keyup.enter="handleSave"
              />
            </div>

            <!-- Ingredients List -->
            <div class="mb-6">
              <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Icon icon="mdi:format-list-checks" class="text-lg text-emerald-600" />
                Ingredients ({{ ingredients.length }})
              </h3>
              <div class="grid grid-cols-2 gap-3">
                <div
                  v-for="(ingredient, index) in ingredients"
                  :key="index"
                  class="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <Icon icon="mdi:checkbox-marked-circle" class="text-emerald-600 flex-shrink-0" />
                  <span class="text-sm text-gray-800">{{ ingredient }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50"
          >
            <button
              class="px-6 py-3 text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-xl transition-all duration-300 font-semibold border border-gray-300"
              @click="handleClose"
            >
              Cancel
            </button>
            <button
              class="px-6 py-3 text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl transition-all duration-300 font-semibold flex items-center gap-2 shadow-lg hover:shadow-green-500/50 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!recipeName.trim()"
              @click="handleSave"
            >
              <Icon icon="mdi:content-save" class="text-xl" />
              Save Recipe
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .animate-scale-in,
.modal-leave-active .animate-scale-in {
  transition: transform 0.3s ease;
}

.modal-enter-from .animate-scale-in,
.modal-leave-to .animate-scale-in {
  transform: scale(0.9);
}
</style>

