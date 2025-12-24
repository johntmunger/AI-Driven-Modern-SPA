<script setup lang="ts">
import { ref, nextTick } from "vue";
import { Icon } from "@iconify/vue";

interface Props {
  recipeName: string;
  recipeId: number | null;
  recipeUpdatedAt?: string;
}

defineProps<Props>();

const emit = defineEmits<{
  updateName: [newName: string];
  deleteRecipe: [];
}>();

const isEditing = ref(false);
const editValue = ref("");
const inputRef = ref<any>(null);

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

const handleKeydown = (event: any) => {
  if (event.key === "Enter") {
    saveEdit();
  } else if (event.key === "Escape") {
    cancelEdit();
  }
};

// Format timestamp for display
const formatDate = (dateString?: string) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "last week";
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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
        class="w-full px-3 py-2 text-base sm:text-lg font-semibold text-green-700 bg-white border border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />
    </div>
    <div v-else class="flex-1 flex items-baseline gap-2 flex-wrap">
      <Icon icon="mdi:chef-hat" class="text-2xl text-green-700 shrink-0 self-center" />
      <h2
        class="text-lg sm:text-xl font-semibold"
        :class="recipeId ? 'text-green-700' : 'text-gray-500'"
      >
        {{ recipeName }}
      </h2>
      <span
        v-if="recipeId && recipeUpdatedAt"
        class="text-[10px] sm:text-xs text-gray-500 font-normal"
      >
        ({{ formatDate(recipeUpdatedAt) }})
      </span>
    </div>

    <!-- Action Buttons - Button style with borders -->
    <div class="flex items-center gap-1 transition-opacity duration-300">
      <button
        class="p-1.5 text-gray-600 hover:text-blue-600 bg-white hover:bg-blue-50 rounded border border-gray-300 hover:border-blue-400 transition-all duration-200 shadow-sm"
        aria-label="Edit recipe name"
        title="Edit recipe name"
        @click="startEdit(recipeName)"
      >
        <Icon icon="mdi:pencil" class="text-base" />
      </button>
      <button
        class="p-1.5 text-gray-600 hover:text-red-600 bg-white hover:bg-red-50 rounded border border-gray-300 hover:border-red-400 transition-all duration-200 shadow-sm"
        aria-label="Delete recipe"
        title="Delete recipe"
        @click="emit('deleteRecipe')"
      >
        <Icon icon="mdi:delete" class="text-base" />
      </button>
    </div>
  </div>
</template>
