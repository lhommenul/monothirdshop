<script setup lang="ts">
import { ref } from 'vue';
import type { Step } from '@/types/Step';

// Liste des étapes du tutoriel
const steps = ref<Step[]>([]);

// Fonction pour recevoir une nouvelle étape du composant StepForm
const addStep = (newStep: Step) => {
  // Vérifier si l'étape existe déjà (même numéro d'ordre)
  const existingIndex = steps.value.findIndex(step => step.orderNumber === newStep.orderNumber);

  if (existingIndex !== -1) {
    // Remplacer l'étape existante
    steps.value[existingIndex] = newStep;
  } else {
    // Ajouter la nouvelle étape
    steps.value.push(newStep);
    // Trier les étapes par numéro d'ordre
    steps.value.sort((a, b) => a.orderNumber - b.orderNumber);
  }
};

// Fonction pour supprimer une étape
const removeStep = (index: number) => {
  steps.value.splice(index, 1);
};

// Fonction pour déplacer une étape vers le haut
const moveStepUp = (index: number) => {
  if (index === 0) return;

  // Échanger les numéros d'ordre
  const tempOrderNumber = steps.value[index - 1].orderNumber;
  steps.value[index - 1].orderNumber = steps.value[index].orderNumber;
  steps.value[index].orderNumber = tempOrderNumber;

  // Échanger les étapes
  [steps.value[index - 1], steps.value[index]] = [steps.value[index], steps.value[index - 1]];
};

// Fonction pour déplacer une étape vers le bas
const moveStepDown = (index: number) => {
  if (index === steps.value.length - 1) return;

  // Échanger les numéros d'ordre
  const tempOrderNumber = steps.value[index + 1].orderNumber;
  steps.value[index + 1].orderNumber = steps.value[index].orderNumber;
  steps.value[index].orderNumber = tempOrderNumber;

  // Échanger les étapes
  [steps.value[index + 1], steps.value[index]] = [steps.value[index], steps.value[index + 1]];
};

defineExpose({
  steps,
  addStep
});
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-lg font-medium">Liste des étapes</h3>

    <div v-if="steps.length === 0" class="p-4 bg-gray-50 rounded-md text-center text-gray-500">
      Aucune étape ajoutée. Utilisez le formulaire ci-dessous pour ajouter des étapes au tutoriel.
    </div>

    <div v-else class="space-y-3">
      <div v-for="(step, index) in steps" :key="index" class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div class="flex justify-between items-start">
          <div class="flex items-center space-x-2">
            <div class="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-md font-bold">
              {{ step.orderNumber }}
            </div>
            <h4 class="text-lg font-medium">{{ step.title }}</h4>
          </div>

          <div class="flex items-center space-x-2">
            <button type="button" @click="moveStepUp(index)" :disabled="index === 0"
              :class="{ 'opacity-50 cursor-not-allowed': index === 0 }"
              class="p-1 text-gray-500 hover:text-gray-700 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                  clip-rule="evenodd" />
              </svg>
            </button>
            <button type="button" @click="moveStepDown(index)" :disabled="index === steps.length - 1"
              :class="{ 'opacity-50 cursor-not-allowed': index === steps.length - 1 }"
              class="p-1 text-gray-500 hover:text-gray-700 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                  clip-rule="evenodd" />
              </svg>
            </button>
            <button type="button" @click="removeStep(index)"
              class="p-1 text-red-500 hover:text-red-700 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <p class="mt-2 text-gray-600">{{ step.description }}</p>

        <!-- Avertissements -->
        <div v-if="step.warnings && step.warnings.length > 0" class="mt-3">
          <h5 class="text-sm font-medium text-yellow-800">Avertissements:</h5>
          <ul class="mt-1 pl-5 list-disc text-sm text-yellow-700">
            <li v-for="(warning, wIndex) in step.warnings" :key="wIndex">{{ warning }}</li>
          </ul>
        </div>

        <!-- Compteurs de médias -->
        <div class="mt-3 flex space-x-4 text-sm text-gray-500">
          <div v-if="step.images && step.images.length > 0" class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ step.images.length }} image(s)
          </div>
          <div v-if="step.videos && step.videos.length > 0" class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {{ step.videos.length }} vidéo(s)
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
