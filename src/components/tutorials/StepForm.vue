<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { Step, StepImage, StepVideo } from '@/types/Step';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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

// État des modales
const isWarningModalOpen = ref(false);
const isImageModalOpen = ref(false);
const isVideoModalOpen = ref(false);

// Fonction pour ajouter un avertissement
const addWarning = () => {
  if (!warningInput.value.trim()) return;
  if (!step.warnings) step.warnings = [];
  step.warnings.push(warningInput.value);
  warningInput.value = '';
};

// Fonction pour soumettre un avertissement via la modale
const submitWarning = () => {
  addWarning();
  if (warningInput.value.trim() === '') {
    isWarningModalOpen.value = false;
  }
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

// Fonction pour soumettre une image via la modale
const submitImage = () => {
  addImage();
  if (imageInput.url.trim() === '' && imageInput.caption.trim() === '') {
    isImageModalOpen.value = false;
  }
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

// Fonction pour soumettre une vidéo via la modale
const submitVideo = () => {
  addVideo();
  if (videoInput.url.trim() === '' && videoInput.caption.trim() === '') {
    isVideoModalOpen.value = false;
  }
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

const emit = defineEmits(['step-added']);

// Fonction pour soumettre et émettre l'événement
const submitAndEmit = () => {
  submitStep();
  emit('step-added', { ...step });
  resetForm();
  // Incrémenter le numéro d'ordre pour la prochaine étape
  step.orderNumber += 1;
};

// Ouvrir les modales
const openWarningModal = () => {
  isWarningModalOpen.value = true;
};

const openImageModal = () => {
  isImageModalOpen.value = true;
};

const openVideoModal = () => {
  isVideoModalOpen.value = true;
};

// Fermer les modales
const closeWarningModal = () => {
  isWarningModalOpen.value = false;
  warningInput.value = '';
};

const closeImageModal = () => {
  isImageModalOpen.value = false;
  imageInput.url = '';
  imageInput.caption = '';
};

const closeVideoModal = () => {
  isVideoModalOpen.value = false;
  videoInput.url = '';
  videoInput.caption = '';
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

      <!-- Boutons de raccourci pour ouvrir les modales -->
      <div class="flex flex-wrap gap-2">
        <button type="button" @click="openWarningModal"
          class="inline-flex items-center px-3 py-1 text-sm border rounded-full"
          :class="step.warnings.length ? 'bg-yellow-100 border-yellow-300 text-yellow-800' : 'bg-white border-gray-300'">
          <span v-if="step.warnings.length" class="mr-1 font-medium">{{ step.warnings.length }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Avertissements
        </button>

        <button type="button" @click="openImageModal"
          class="inline-flex items-center px-3 py-1 text-sm border rounded-full"
          :class="step.images.length ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-white border-gray-300'">
          <span v-if="step.images.length" class="mr-1 font-medium">{{ step.images.length }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Images
        </button>

        <button type="button" @click="openVideoModal"
          class="inline-flex items-center px-3 py-1 text-sm border rounded-full"
          :class="step.videos.length ? 'bg-purple-100 border-purple-300 text-purple-800' : 'bg-white border-gray-300'">
          <span v-if="step.videos.length" class="mr-1 font-medium">{{ step.videos.length }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Vidéos
        </button>
      </div>

      <!-- Liste des éléments ajoutés -->
      <!-- Avertissements -->
      <div v-if="step.warnings.length > 0" class="mt-4">
        <h4 class="text-md font-semibold text-yellow-800 mb-2">Avertissements ajoutés</h4>
        <ul class="space-y-2">
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
      <div v-if="step.images.length > 0" class="mt-4">
        <h4 class="text-md font-semibold text-blue-800 mb-2">Images ajoutées</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      <div v-if="step.videos.length > 0" class="mt-4">
        <h4 class="text-md font-semibold text-purple-800 mb-2">Vidéos ajoutées</h4>
        <ul class="space-y-2">
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

    <!-- Modales shadcn-vue -->
    <!-- Modale d'avertissement -->
    <Dialog :open="isWarningModalOpen" @update:open="(value) => isWarningModalOpen = value">
      <DialogContent class="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle class="text-yellow-800">Ajouter un avertissement</DialogTitle>
          <DialogDescription>
            Ajoutez un avertissement pour cette étape. Ces avertissements seront affichés de manière proéminente.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-1 items-center gap-4">
            <div class="col-span-1">
              <label for="warning-modal-input" class="text-sm font-medium">Texte de l'avertissement</label>
              <Textarea id="warning-modal-input" v-model="warningInput" placeholder="Saisissez l'avertissement ici..."
                rows="3" class="mt-1 border-yellow-300 focus:ring-yellow-500 focus:border-yellow-500" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="closeWarningModal">Annuler</Button>
          <Button variant="default" class="bg-yellow-600 hover:bg-yellow-700" @click="submitWarning">
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Modale d'image -->
    <Dialog :open="isImageModalOpen" @update:open="(value) => isImageModalOpen = value">
      <DialogContent class="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle class="text-blue-800">Ajouter une image</DialogTitle>
          <DialogDescription>
            Ajoutez une image avec sa légende pour cette étape.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-1 items-center gap-4">
            <div class="col-span-1">
              <label for="image-url-modal" class="text-sm font-medium">URL de l'image</label>
              <Input id="image-url-modal" v-model="imageInput.url" placeholder="https://example.com/image.jpg"
                class="mt-1 border-blue-300 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div class="col-span-1">
              <label for="image-caption-modal" class="text-sm font-medium">Légende</label>
              <Input id="image-caption-modal" v-model="imageInput.caption" placeholder="Description de l'image"
                class="mt-1 border-blue-300 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="closeImageModal">Annuler</Button>
          <Button variant="default" class="bg-blue-600 hover:bg-blue-700" @click="submitImage">
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Modale de vidéo -->
    <Dialog :open="isVideoModalOpen" @update:open="(value) => isVideoModalOpen = value">
      <DialogContent class="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle class="text-purple-800">Ajouter une vidéo</DialogTitle>
          <DialogDescription>
            Ajoutez une vidéo avec sa légende pour cette étape.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-1 items-center gap-4">
            <div class="col-span-1">
              <label for="video-url-modal" class="text-sm font-medium">URL de la vidéo</label>
              <Input id="video-url-modal" v-model="videoInput.url" placeholder="https://example.com/video.mp4"
                class="mt-1 border-purple-300 focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div class="col-span-1">
              <label for="video-caption-modal" class="text-sm font-medium">Légende</label>
              <Input id="video-caption-modal" v-model="videoInput.caption" placeholder="Description de la vidéo"
                class="mt-1 border-purple-300 focus:ring-purple-500 focus:border-purple-500" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="closeVideoModal">Annuler</Button>
          <Button variant="default" class="bg-purple-600 hover:bg-purple-700" @click="submitVideo">
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
