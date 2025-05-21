<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { Tutorial, TutorialDuration } from '@/types/Tutorial';
import StepList from './StepList.vue';
import StepForm from './StepForm.vue';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import FormNav from "./FormNav.astro"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// État initial du tutoriel
const tutorial = reactive<Tutorial>({
  title: '',
  introduction: '',
  difficulty: 'moderate',
  duration: { value: 30, unit: 'minutes' },
  vehicle: '',
  status: 'draft',
  tags: [],
  requiredTools: [],
  requiredParts: []
});

// État pour les outils et pièces requis
const requiredToolInput = ref('');
const requiredPartInput = ref('');
const newTag = ref('');

// État pour les modales
const isToolModalOpen = ref(false);
const isPartModalOpen = ref(false);
const isTagModalOpen = ref(false);
const activeSection = ref('basic');

// Liste des véhicules (à remplacer par une requête API)
const vehicles = [
  { _id: 'v1', name: 'Renault Clio' },
  { _id: 'v2', name: 'Peugeot 208' },
  { _id: 'v3', name: 'Citroën C3' }
];

// Fonctions pour gérer les sections
const setActiveSection = (section: string) => {
  if (activeSection.value === section) {
    activeSection.value = 'basic'; // Replier si déjà actif
  } else {
    activeSection.value = section;
  }
};

// Fonctions pour les modales
const openToolModal = () => {
  isToolModalOpen.value = true;
  requiredToolInput.value = '';
};

const openPartModal = () => {
  isPartModalOpen.value = true;
  requiredPartInput.value = '';
};

const openTagModal = () => {
  isTagModalOpen.value = true;
  newTag.value = '';
};

// Fonction pour ajouter un outil requis
const addRequiredTool = () => {
  if (!requiredToolInput.value.trim()) return;
  if (!tutorial.requiredTools) tutorial.requiredTools = [];
  tutorial.requiredTools.push(requiredToolInput.value);
  requiredToolInput.value = '';
};

// Fonction pour soumettre un outil via la modale
const submitTool = () => {
  addRequiredTool();
  if (requiredToolInput.value.trim() === '') {
    isToolModalOpen.value = false;
  }
};

// Fonction pour ajouter une pièce requise
const addRequiredPart = () => {
  if (!requiredPartInput.value.trim()) return;
  if (!tutorial.requiredParts) tutorial.requiredParts = [];
  tutorial.requiredParts.push(requiredPartInput.value);
  requiredPartInput.value = '';
};

// Fonction pour soumettre une pièce via la modale
const submitPart = () => {
  addRequiredPart();
  if (requiredPartInput.value.trim() === '') {
    isPartModalOpen.value = false;
  }
};

// Fonction pour ajouter un tag
const addTag = () => {
  if (!newTag.value.trim()) return;
  if (!tutorial.tags) tutorial.tags = [];
  tutorial.tags.push(newTag.value);
  newTag.value = '';
};

// Fonction pour soumettre un tag via la modale
const submitTag = () => {
  addTag();
  if (newTag.value.trim() === '') {
    isTagModalOpen.value = false;
  }
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
      <!-- Informations de base - toujours visibles -->
      <div v-if="activeSection === 'basic'" class="space-y-4 transition-all">
        <h2 class="text-xl font-semibold text-indigo-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Informations de base
        </h2>

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

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-1">
            <label for="duration-value" class="block text-sm font-medium text-gray-700">Durée</label>
            <input id="duration-value" v-model="tutorial.duration.value" type="number" min="1"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div class="md:col-span-1">
            <label for="duration-unit" class="block text-sm font-medium text-gray-700">Unité</label>
            <select id="duration-unit" v-model="tutorial.duration.unit"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option value="minutes">Minutes</option>
              <option value="hours">Heures</option>
            </select>
          </div>
          <div class="md:col-span-1">
            <label for="status" class="block text-sm font-medium text-gray-700">Statut</label>
            <select id="status" v-model="tutorial.status"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
          </div>
        </div>

        <div>
          <label for="featuredImage" class="block text-sm font-medium text-gray-700">Image principale</label>
          <input type="text" id="featuredImage" v-model="tutorial.featuredImage" placeholder="URL de l'image"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
      </div>

      <!-- Outils requis -->
      <div v-if="activeSection === 'tools'" class="border border-green-200 rounded-md p-4 bg-green-50 transition-all">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-green-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Outils requis
          </h2>
          <button type="button" @click="openToolModal"
            class="inline-flex items-center px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Ajouter un outil
          </button>
        </div>

        <ul class="space-y-2 mt-2">
          <li v-for="(tool, index) in tutorial.requiredTools" :key="index"
            class="flex justify-between items-center px-3 py-2 bg-white border border-green-200 rounded-md">
            <span>{{ tool }}</span>
            <button type="button" @click="removeRequiredTool(index)"
              class="text-red-500 hover:text-red-700 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </li>
        </ul>
        <p v-if="!tutorial.requiredTools?.length" class="text-sm text-gray-500 italic mt-2">
          Aucun outil ajouté pour le moment. Cliquez sur "Ajouter un outil" pour commencer.
        </p>
      </div>

      <!-- Pièces requises -->
      <div v-if="activeSection === 'parts'" class="border border-orange-200 rounded-md p-4 bg-orange-50 transition-all">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-orange-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
            </svg>
            Pièces requises
          </h2>
          <button type="button" @click="openPartModal"
            class="inline-flex items-center px-3 py-1.5 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Ajouter une pièce
          </button>
        </div>

        <ul class="space-y-2 mt-2">
          <li v-for="(part, index) in tutorial.requiredParts" :key="index"
            class="flex justify-between items-center px-3 py-2 bg-white border border-orange-200 rounded-md">
            <span>{{ part }}</span>
            <button type="button" @click="removeRequiredPart(index)"
              class="text-red-500 hover:text-red-700 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </li>
        </ul>
        <p v-if="!tutorial.requiredParts?.length" class="text-sm text-gray-500 italic mt-2">
          Aucune pièce ajoutée pour le moment. Cliquez sur "Ajouter une pièce" pour commencer.
        </p>
      </div>

      <!-- Tags -->
      <div v-if="activeSection === 'tags'" class="border border-purple-200 rounded-md p-4 bg-purple-50 transition-all">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-purple-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Tags
          </h2>
          <button type="button" @click="openTagModal"
            class="inline-flex items-center px-3 py-1.5 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Ajouter un tag
          </button>
        </div>

        <div class="flex flex-wrap gap-2 mt-2">
          <div v-for="(tag, index) in tutorial.tags" :key="index"
            class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full flex items-center">
            <span>{{ tag }}</span>
            <button type="button" @click="removeTag(index)"
              class="ml-2 text-purple-600 hover:text-purple-800 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <p v-if="!tutorial.tags?.length" class="text-sm text-gray-500 italic mt-2">
          Aucun tag ajouté pour le moment. Cliquez sur "Ajouter un tag" pour commencer.
        </p>
      </div>

      <!-- Étapes du tutoriel -->
      <div v-if="activeSection === 'steps'" class="border border-red-200 rounded-md p-4 bg-red-50 transition-all">
        <h2 class="text-xl font-semibold text-red-800 flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Étapes du tutoriel
        </h2>
        <StepList />
        <StepForm />
      </div>

      <!-- Boutons d'action -->
      <div class="flex justify-end space-x-3 pt-4 sticky bottom-0 bg-white pb-4 border-t mt-6 pt-4">
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

    <!-- Modales shadcn-vue -->
    <!-- Modale d'ajout d'outil -->
    <Dialog :open="isToolModalOpen" @update:open="(value) => isToolModalOpen = value">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle class="text-green-800">Ajouter un outil requis</DialogTitle>
          <DialogDescription>
            Ajoutez un outil nécessaire pour réaliser ce tutoriel.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-1 items-center gap-4">
            <div class="col-span-1">
              <label for="tool-input" class="text-sm font-medium">Nom de l'outil</label>
              <Input id="tool-input" v-model="requiredToolInput" placeholder="ex: Clé à molette, tournevis, etc."
                class="mt-1 border-green-300 focus:ring-green-500 focus:border-green-500" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="isToolModalOpen = false">Annuler</Button>
          <Button variant="default" class="bg-green-600 hover:bg-green-700" @click="submitTool">
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Modale d'ajout de pièce -->
    <Dialog :open="isPartModalOpen" @update:open="(value) => isPartModalOpen = value">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle class="text-orange-800">Ajouter une pièce requise</DialogTitle>
          <DialogDescription>
            Ajoutez une pièce nécessaire pour réaliser ce tutoriel.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-1 items-center gap-4">
            <div class="col-span-1">
              <label for="part-input" class="text-sm font-medium">Nom de la pièce</label>
              <Input id="part-input" v-model="requiredPartInput" placeholder="ex: Filtre à huile, ampoule H7, etc."
                class="mt-1 border-orange-300 focus:ring-orange-500 focus:border-orange-500" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="isPartModalOpen = false">Annuler</Button>
          <Button variant="default" class="bg-orange-600 hover:bg-orange-700" @click="submitPart">
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Modale d'ajout de tag -->
    <Dialog :open="isTagModalOpen" @update:open="(value) => isTagModalOpen = value">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle class="text-purple-800">Ajouter un tag</DialogTitle>
          <DialogDescription>
            Ajoutez un tag pour aider à catégoriser ce tutoriel.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-1 items-center gap-4">
            <div class="col-span-1">
              <label for="tag-input" class="text-sm font-medium">Nom du tag</label>
              <Input id="tag-input" v-model="newTag" placeholder="ex: Entretien, Réparation, Débutant, etc."
                class="mt-1 border-purple-300 focus:ring-purple-500 focus:border-purple-500" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="isTagModalOpen = false">Annuler</Button>
          <Button variant="default" class="bg-purple-600 hover:bg-purple-700" @click="submitTag">
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
