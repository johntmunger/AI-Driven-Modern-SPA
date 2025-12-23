<script setup lang="ts">
import { ref, nextTick } from "vue";
import { Icon } from "@iconify/vue";

interface Props {
  recipeName: string;
  recipeId: number | null;
}

defineProps<Props>();

const emit = defineEmits<{
  updateName: [newName: string];
  deleteRecipe: [];
}>();

const isEditing = ref(false);
const editValue = ref("");
const inputRef = ref<HTMLInputElement | null>(null);

const startEdit = (currentName: string) => {
  isEditing.value = true;
  editValue.value = currentName;
  nextTick(() => {
    inputRef.value?.focus();
    inputRef.value?.select();
  });
};

const saveEdit = () => {
  if (editValue.value.trim() && editValue.value.trim() !== "") {
    emit("updateName", editValue.value.trim());
  }
  isEditing.value = false;
};

const cancelEdit = () => {
  isEditing.value = false;
  editValue.value = "";
};

const handleBlur = () => {
  if (isEditing.value) {
    saveEdit();
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    saveEdit();
  } else if (event.key === "Escape") {
    cancelEdit();
  }
};
</script>

<template>
  <div class="mb-4 sm:mb-6 flex items-center justify-between gap-3 group">
    <!-- Recipe Name -->
    <div v-if="isEditing" class="flex-1">
      <input
        ref="inputRef"
        v-model="editValue"
        type="text"
        class="w-full px-3 py-2 text-lg sm:text-xl font-semibold text-green-700 bg-white border border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />
    </div>
    <div v-else class="flex-1 flex items-center gap-2">
      <Icon icon="mdi:chef-hat" class="text-2xl text-green-700 flex-shrink-0" />
      <h2
        class="text-lg sm:text-xl font-semibold"
        :class="recipeId ? 'text-green-700' : 'text-gray-500'"
      >
        {{ recipeName }}
      </h2>
    </div>

    <!-- Action Buttons - Smaller secondary style -->
    <div class="flex items-center gap-1 transition-opacity duration-300">
      <button
        class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all duration-200"
        aria-label="Edit recipe name"
        title="Edit recipe name"
        @click="startEdit(recipeName)"
      >
        <Icon icon="mdi:pencil" class="text-base" />
      </button>
      <button
        class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all duration-200"
        aria-label="Delete recipe"
        title="Delete recipe"
        @click="emit('deleteRecipe')"
      >
        <Icon icon="mdi:delete" class="text-base" />
      </button>
    </div>
  </div>
</template>
