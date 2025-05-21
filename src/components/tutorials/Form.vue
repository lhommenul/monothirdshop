<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { Tutorial, TutorialDuration } from '@/types/Tutorial';
import StepList from './StepList.vue';
import StepForm from './StepForm.vue';

// État initial du tutoriel
const tutorial = reactive<Tutorial>({
  title: '',
  introduction: '',
  difficulty: 'moderate',
  duration: { value: 30, unit: 'minutes' },
  vehicle: '',
  status: 'draft',
  tags: []
});

// État pour les outils et pièces requis
const requiredToolInput = ref('');
const requiredPartInput = ref('');
const newTag = ref('');

// Liste des véhicules (à remplacer par une requête API)
const vehicles = [
  { _id: 'v1', name: 'Renault Clio' },
  { _id: 'v2', name: 'Peugeot 208' },
  { _id: 'v3', name: 'Citroën C3' }
];

// Fonction pour ajouter un outil requis
const addRequiredTool = () => {
  if (!requiredToolInput.value.trim()) return;
  if (!tutorial.requiredTools) tutorial.requiredTools = [];
  tutorial.requiredTools.push(requiredToolInput.value);
  requiredToolInput.value = '';
};

// Fonction pour ajouter une pièce requise
const addRequiredPart = () => {
  if (!requiredPartInput.value.trim()) return;
  if (!tutorial.requiredParts) tutorial.requiredParts = [];
  tutorial.requiredParts.push(requiredPartInput.value);
  requiredPartInput.value = '';
};

// Fonction pour ajouter un tag
const addTag = () => {
  if (!newTag.value.trim()) return;
  if (!tutorial.tags) tutorial.tags = [];
  tutorial.tags.push(newTag.value);
  newTag.value = '';
};

// Fonction pour supprimer un outil requis
const removeRequiredTool = (index: number) => {
  if (tutorial.requiredTools) {
    tutorial.requiredTools.splice(index, 1);
  }
};

// Fonction pour supprimer une pièce requise
const removeRequiredPart = (index: number) => {
  if (tutorial.requiredParts) {
    tutorial.requiredParts.splice(index, 1);
  }
};

// Fonction pour supprimer un tag
const removeTag = (index: number) => {
  if (tutorial.tags) {
    tutorial.tags.splice(index, 1);
  }
};

// Fonction pour soumettre le formulaire
const submitTutorial = () => {
  // Ici, vous enverriez les données à votre API
  console.log('Tutoriel à soumettre:', tutorial);
  // À implémenter: appel API pour créer le tutoriel
};
</script>

<template>
  <div class="mx-auto p-4 bg-white rounded-lg shadow-md">
    <h1 class="text-2xl font-bold mb-6">Créer un nouveau tutoriel</h1>

    <form @submit.prevent="submitTutorial" class="space-y-6">
      <!-- Informations de base -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold">Informations de base</h2>

        <div>
          <label for="title" class="block text-sm font-medium text-gray-700">Titre</label>
          <input id="title" v-model="tutorial.title" required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>

        <div>
          <label for="introduction" class="block text-sm font-medium text-gray-700">Introduction</label>
          <textarea id="introduction" v-model="tutorial.introduction" required rows="4"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
        </div>

        <div>
          <label for="difficulty" class="block text-sm font-medium text-gray-700">Difficulté</label>
          <select id="difficulty" v-model="tutorial.difficulty"
            class="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            <option value="easy">Facile</option>
            <option value="moderate">Modéré</option>
            <option value="hard">Difficile</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="duration-value" class="block text-sm font-medium text-gray-700">Durée</label>
            <input id="duration-value" v-model="tutorial.duration.value" type="number" min="1"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label for="duration-unit" class="block text-sm font-medium text-gray-700">Unité</label>
            <select id="duration-unit" v-model="tutorial.duration.unit"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option value="minutes">Minutes</option>
              <option value="hours">Heures</option>
            </select>
          </div>
        </div>

        <div>
          <label for="vehicle" class="block text-sm font-medium text-gray-700">Véhicule</label>
          <select id="vehicle" v-model="tutorial.vehicle" required
            class="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            <option value="" disabled>Sélectionnez un véhicule</option>
            <option v-for="vehicle in vehicles" :key="vehicle._id" :value="vehicle._id">
              {{ vehicle.name }}
            </option>
          </select>
        </div>

        <div>
          <label for="featuredImage" class="block text-sm font-medium text-gray-700">Image principale</label>
          <input type="text" id="featuredImage" v-model="tutorial.featuredImage" placeholder="URL de l'image"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
      </div>

      <!-- Outils requis -->
      <div class="space-y-3">
        <h2 class="text-xl font-semibold">Outils requis</h2>

        <div class="flex">
          <input type="text" v-model="requiredToolInput" placeholder="Nouvel outil"
            class="flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          <button type="button" @click="addRequiredTool"
            class="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Ajouter
          </button>
        </div>

        <ul class="space-y-2">
          <li v-for="(tool, index) in tutorial.requiredTools" :key="index"
            class="flex justify-between items-center px-3 py-2 bg-gray-50 rounded-md">
            <span>{{ tool }}</span>
            <button type="button" @click="removeRequiredTool(index)"
              class="text-red-500 hover:text-red-700 focus:outline-none">
              Supprimer
            </button>
          </li>
        </ul>
      </div>

      <!-- Pièces requises -->
      <div class="space-y-3">
        <h2 class="text-xl font-semibold">Pièces requises</h2>

        <div class="flex">
          <input type="text" v-model="requiredPartInput" placeholder="Nouvelle pièce"
            class="flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          <button type="button" @click="addRequiredPart"
            class="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Ajouter
          </button>
        </div>

        <ul class="space-y-2">
          <li v-for="(part, index) in tutorial.requiredParts" :key="index"
            class="flex justify-between items-center px-3 py-2 bg-gray-50 rounded-md">
            <span>{{ part }}</span>
            <button type="button" @click="removeRequiredPart(index)"
              class="text-red-500 hover:text-red-700 focus:outline-none">
              Supprimer
            </button>
          </li>
        </ul>
      </div>

      <!-- Tags -->
      <div class="space-y-3">
        <h2 class="text-xl font-semibold">Tags</h2>

        <div class="flex">
          <input type="text" v-model="newTag" placeholder="Nouveau tag"
            class="flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          <button type="button" @click="addTag"
            class="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Ajouter
          </button>
        </div>

        <div class="flex flex-wrap gap-2">
          <div v-for="(tag, index) in tutorial.tags" :key="index"
            class="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full flex items-center">
            <span>{{ tag }}</span>
            <button type="button" @click="removeTag(index)"
              class="ml-2 text-indigo-600 hover:text-indigo-800 focus:outline-none">
              &times;
            </button>
          </div>
        </div>
      </div>

      <!-- Statut -->
      <div>
        <h2 class="text-xl font-semibold mb-3">Statut</h2>
        <div class="flex items-center space-x-4">
          <label class="inline-flex items-center">
            <input type="radio" v-model="tutorial.status" value="draft" class="form-radio text-indigo-600" />
            <span class="ml-2">Brouillon</span>
          </label>
          <label class="inline-flex items-center">
            <input type="radio" v-model="tutorial.status" value="published" class="form-radio text-indigo-600" />
            <span class="ml-2">Publié</span>
          </label>
        </div>
      </div>

      <!-- Étapes du tutoriel -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold">Étapes du tutoriel</h2>
        <StepList />
        <StepForm />
      </div>

      <!-- Boutons d'action -->
      <div class="flex justify-end space-x-3 pt-4">
        <button type="button"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Annuler
        </button>
        <button type="submit"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Enregistrer le tutoriel
        </button>
      </div>
    </form>
  </div>
</template>
