<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { Step, StepImage, StepVideo } from '@/types/Step';

// Id du tutoriel (à récupérer depuis le parent ou via props)
const props = defineProps<{
  tutorialId?: string;
}>();

// État de l'étape
const step = reactive<Step>({
  tutorial: props.tutorialId || '',
  orderNumber: 1,
  title: '',
  description: '',
  warnings: [],
  images: [],
  videos: []
});

// État pour les entrées de formulaire
const warningInput = ref('');
const imageInput = reactive<{ url: string, caption: string }>({ url: '', caption: '' });
const videoInput = reactive<{ url: string, caption: string }>({ url: '', caption: '' });

// Fonction pour ajouter un avertissement
const addWarning = () => {
  if (!warningInput.value.trim()) return;
  if (!step.warnings) step.warnings = [];
  step.warnings.push(warningInput.value);
  warningInput.value = '';
};

// Fonction pour supprimer un avertissement
const removeWarning = (index: number) => {
  if (step.warnings) {
    step.warnings.splice(index, 1);
  }
};

// Fonction pour ajouter une image
const addImage = () => {
  if (!imageInput.url.trim() || !imageInput.caption.trim()) return;
  if (!step.images) step.images = [];
  step.images.push({
    url: imageInput.url,
    caption: imageInput.caption
  });
  imageInput.url = '';
  imageInput.caption = '';
};

// Fonction pour supprimer une image
const removeImage = (index: number) => {
  if (step.images) {
    step.images.splice(index, 1);
  }
};

// Fonction pour ajouter une vidéo
const addVideo = () => {
  if (!videoInput.url.trim() || !videoInput.caption.trim()) return;
  if (!step.videos) step.videos = [];
  step.videos.push({
    url: videoInput.url,
    caption: videoInput.caption
  });
  videoInput.url = '';
  videoInput.caption = '';
};

// Fonction pour supprimer une vidéo
const removeVideo = (index: number) => {
  if (step.videos) {
    step.videos.splice(index, 1);
  }
};

// Fonction pour soumettre le formulaire
const submitStep = () => {
  // Ici, vous enverriez les données à votre API
  console.log('Étape à soumettre:', step);
  // À implémenter: appel API pour créer l'étape
};

// Fonction pour réinitialiser le formulaire
const resetForm = () => {
  step.title = '';
  step.description = '';
  step.warnings = [];
  step.images = [];
  step.videos = [];
  warningInput.value = '';
  imageInput.url = '';
  imageInput.caption = '';
  videoInput.url = '';
  videoInput.caption = '';
};

const isVisible = reactive({
  warnings: false,
  images: false,
  videos: false
})

function toggleSection(section) {
  isVisible[section] = !isVisible[section];
}

const emit = defineEmits(['step-added']);

// Fonction pour soumettre et émettre l'événement
const submitAndEmit = () => {
  submitStep();
  emit('step-added', { ...step });
  resetForm();
  // Incrémenter le numéro d'ordre pour la prochaine étape
  step.orderNumber += 1;
};
</script>

<template>
  <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
    <h3 class="text-lg font-medium">Ajouter une étape</h3>

    <form @submit.prevent="submitAndEmit" class="space-y-4">
      <!-- Champs obligatoires toujours visibles -->
      <div class="grid grid-cols-6 gap-4">
        <div class="col-span-1">
          <label for="orderNumber" class="block text-sm font-medium text-gray-700">Numéro</label>
          <input id="orderNumber" v-model="step.orderNumber" type="number" min="1" required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div class="col-span-5">
          <label for="step-title" class="block text-sm font-medium text-gray-700">Titre</label>
          <input id="step-title" v-model="step.title" required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
      </div>

      <div>
        <label for="step-description" class="block text-sm font-medium text-gray-700">Description</label>
        <textarea id="step-description" v-model="step.description" required rows="4"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
      </div>

      <!-- Boutons de raccourci pour afficher les sections optionnelles -->
      <div class="flex flex-wrap gap-2">
        <button type="button" @click="toggleSection('warnings')"
          class="inline-flex items-center px-3 py-1 text-sm border rounded-full"
          :class="isVisible.warnings ? 'bg-yellow-100 border-yellow-300 text-yellow-800' : 'bg-white border-gray-300'">
          <span v-if="step.warnings.length" class="mr-1 font-medium">{{ step.warnings.length }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Avertissements
        </button>

        <button type="button" @click="toggleSection('images')"
          class="inline-flex items-center px-3 py-1 text-sm border rounded-full"
          :class="isVisible.images ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-white border-gray-300'">
          <span v-if="step.images.length" class="mr-1 font-medium">{{ step.images.length }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Images
        </button>

        <button type="button" @click="toggleSection('videos')"
          class="inline-flex items-center px-3 py-1 text-sm border rounded-full"
          :class="isVisible.videos ? 'bg-purple-100 border-purple-300 text-purple-800' : 'bg-white border-gray-300'">
          <span v-if="step.videos.length" class="mr-1 font-medium">{{ step.videos.length }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Vidéos
        </button>
      </div>

      <!-- Sections masquées par défaut -->
      <!-- Avertissements -->
      <div v-if="isVisible.warnings" class="border border-yellow-200 rounded-md p-3 bg-yellow-50 transition-all">
        <div class="flex justify-between items-center mb-3">
          <h4 class="text-md font-semibold text-yellow-800">Avertissements</h4>
          <button type="button" @click="toggleSection('warnings')" class="text-yellow-600 hover:text-yellow-800">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="flex">
          <input type="text" v-model="warningInput" placeholder="Nouvel avertissement"
            class="flex-grow px-3 py-2 border border-yellow-300 rounded-l-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500" />
          <button type="button" @click="addWarning"
            class="px-4 py-2 bg-yellow-600 text-white rounded-r-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
            Ajouter
          </button>
        </div>

        <ul class="space-y-2 mt-2">
          <li v-for="(warning, index) in step.warnings" :key="index"
            class="flex justify-between items-center px-3 py-2 bg-yellow-100 text-yellow-800 rounded-md">
            <span>{{ warning }}</span>
            <button type="button" @click="removeWarning(index)"
              class="text-yellow-600 hover:text-yellow-800 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </li>
        </ul>
      </div>

      <!-- Images -->
      <div v-if="isVisible.images" class="border border-blue-200 rounded-md p-3 bg-blue-50 transition-all">
        <div class="flex justify-between items-center mb-3">
          <h4 class="text-md font-semibold text-blue-800">Images</h4>
          <button type="button" @click="toggleSection('images')" class="text-blue-600 hover:text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="image-url" class="block text-sm font-medium text-gray-700">URL de l'image</label>
            <input id="image-url" v-model="imageInput.url" type="text"
              class="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="image-caption" class="block text-sm font-medium text-gray-700">Légende</label>
            <input id="image-caption" v-model="imageInput.caption" type="text"
              class="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>

        <button type="button" @click="addImage"
          class="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Ajouter l'image
        </button>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div v-for="(image, index) in step.images" :key="index"
            class="border border-blue-300 rounded-md overflow-hidden">
            <img :src="image.url" :alt="image.caption" class="w-full h-32 object-cover" />
            <div class="p-2 bg-white">
              <p class="text-sm text-gray-700">{{ image.caption }}</p>
              <button type="button" @click="removeImage(index)"
                class="mt-1 text-sm text-red-500 hover:text-red-700 focus:outline-none">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Vidéos -->
      <div v-if="isVisible.videos" class="border border-purple-200 rounded-md p-3 bg-purple-50 transition-all">
        <div class="flex justify-between items-center mb-3">
          <h4 class="text-md font-semibold text-purple-800">Vidéos</h4>
          <button type="button" @click="toggleSection('videos')" class="text-purple-600 hover:text-purple-800">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="video-url" class="block text-sm font-medium text-gray-700">URL de la vidéo</label>
            <input id="video-url" v-model="videoInput.url" type="text"
              class="mt-1 block w-full px-3 py-2 border border-purple-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
          </div>
          <div>
            <label for="video-caption" class="block text-sm font-medium text-gray-700">Légende</label>
            <input id="video-caption" v-model="videoInput.caption" type="text"
              class="mt-1 block w-full px-3 py-2 border border-purple-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" />
          </div>
        </div>

        <button type="button" @click="addVideo"
          class="w-full mt-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
          Ajouter la vidéo
        </button>

        <ul class="space-y-2 mt-2">
          <li v-for="(video, index) in step.videos" :key="index"
            class="flex justify-between items-center p-3 border border-purple-300 bg-white rounded-md">
            <div>
              <p class="font-medium">{{ video.url }}</p>
              <p class="text-sm text-gray-600">{{ video.caption }}</p>
            </div>
            <button type="button" @click="removeVideo(index)"
              class="text-red-500 hover:text-red-700 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </li>
        </ul>
      </div>

      <!-- Boutons d'action -->
      <div class="flex justify-end space-x-3 pt-4">
        <button type="button" @click="resetForm"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Réinitialiser
        </button>
        <button type="submit"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Ajouter l'étape
        </button>
      </div>
    </form>
  </div>
</template>
