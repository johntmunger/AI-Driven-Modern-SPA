<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";
import { Icon } from "@iconify/vue";

interface Props {
  isOpen: boolean;
  recipeName: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  confirm: [];
}>();

// Handle Escape key
const handleEscape = (event: any) => {
  if (event.key === "Escape" && props.isOpen) {
    emit("close");
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
        @click.self="emit('close')"
      >
        <div
          class="bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-md w-full overflow-hidden animate-scale-in"
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50"
          >
            <div class="flex items-center gap-3">
              <Icon icon="mdi:alert-circle" class="text-4xl text-red-600" />
              <h2 class="text-2xl font-bold text-gray-900">Delete Recipe?</h2>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6">
            <p class="text-gray-700 text-base mb-2">
              Are you sure you want to delete this recipe?
            </p>
            <p class="text-green-600 font-semibold text-lg">
              "{{ recipeName }}"
            </p>
            <p class="text-gray-600 text-sm mt-4">
              This action cannot be undone.
            </p>
          </div>

          <!-- Footer -->
          <div
            class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50"
          >
            <button
              class="px-6 py-3 text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-xl transition-all duration-300 font-semibold border border-gray-300"
              @click="emit('close')"
            >
              Cancel
            </button>
            <button
              class="px-6 py-3 text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded-xl transition-all duration-300 font-semibold flex items-center gap-2 shadow-lg hover:shadow-red-500/50 hover:scale-105 active:scale-95"
              @click="emit('confirm')"
            >
              <Icon icon="mdi:delete" class="text-xl" />
              Delete Recipe
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

