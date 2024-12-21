<script setup lang="ts">
import { ref, computed, markRaw, h }  from 'vue';
import { toast }                      from 'vue-sonner';

import SpotifyLikeToast from './SpotifyLikeToast.vue';
import Modal            from './CustomModal.vue';
import ModalClose       from './ModalClose.vue';

import { useRecommendationStore } from '@/stores/recommendationStore';
import { useLocalSettingsStore }  from '@/stores/localSettingsStore';
import { useAuthStore }           from '@/stores/authStore';

import { addSongToLiked } from '@/utils/addSongToLiked';

const recommendationStore = useRecommendationStore();
const localSettingsStore = useLocalSettingsStore();
const authStore = useAuthStore();

const props = defineProps<{
  currentTrack: SpotifyApi.RecommendationTrackObject | undefined;
}>();

const isLiked = computed(() => {
  return props.currentTrack && recommendationStore.likedTracksSet.has(props.currentTrack.id);
});

const like = () => {
  if (!localSettingsStore.usedLikeFeature) {
    enableModal();
    localSettingsStore.markUsedLikeFeature();
    return;
  }

  if (props.currentTrack) {
    const newSet = new Set(recommendationStore.likedTracksSet);
    newSet.add(props.currentTrack.id);
    recommendationStore.likedTracksSet = newSet;

    const trackName = props.currentTrack.name;
    const trackImage = props.currentTrack.album.images[0].url;
    const trackArtist = props.currentTrack.artists[0].name;
    const toastComponent = h(SpotifyLikeToast, {
      trackName,
      trackImage,
      trackArtist
    });

    addSongToLiked(props.currentTrack.id);

    toast(markRaw(toastComponent));
  }
};

// Modal stuff
const isModalOpen = ref<boolean>(false);

const enableModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};
</script>

<template>
  <Modal :modalValue="isModalOpen" @update:modalValue="isModalOpen = $event">
    <div class="like-warning">
      <b style="font-size: 1.4rem;">Warning!</b>
      <p> 
        Due to the way Spotify handles track IDs, it's <b>possible that a song 
        you've liked may appear to be replaced</b>, even though it's shown as "unliked"
        on this website. This means that <b>the song could be moved to the top of your
        Spotify liked songs</b>, even if it was added months ago.
        <br><br>
        If this is not a concern, feel free to close this message.
        However, please be aware of this behavior when adding songs through this website.
      </p>
      <br>
      <ModalClose style="margin-left: auto;" @click="closeModal" />
    </div>
  </Modal>
  
  <button class="like-button" @click="like" :style="{ pointerEvents: isLiked ? 'none' : 'auto' }" :class="{ 'svg-grey': !authStore.isLoggedIn }" :disabled="!authStore.isLoggedIn">
    <div class="like-wrapper">
      <svg
        class="heart"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        :class="{ liked: isLiked }"
      >
        <path
          d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"
        ></path>
      </svg>
    </div>
  </button>
</template>

<style scoped>
.svg-grey {
  filter: brightness(0) saturate(100%) invert(87%) sepia(3%) saturate(8%) hue-rotate(333deg) brightness(96%) contrast(86%);
}

.svg-grey:hover {
  cursor: not-allowed;
}

.like-warning {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  max-width: 35vw;
  display: flex;
  flex-direction: column;
}

.like-button {
  --color-heart: #1DB954;
  --easing: cubic-bezier(.7,0,.3,1);
  --duration: 0.3s;

  appearance: none;
  width: 2.5em;
  height: 2.5em;
  padding: 0;
  margin: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.like-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.heart {
  width: 1.5em;
  height: 1.5em;
  display: block;
  transform-origin: center center;
  transition: transform var(--duration) var(--easing),
              fill var(--duration) var(--easing);
}

.heart path {
  stroke: var(--color-heart);
  stroke-width: 2.5;
  fill: transparent;
  transition: fill var(--duration) var(--easing);
}

.heart.liked path {
  fill: var(--color-heart);
}

.heart.liked {
  animation: heart-pop var(--duration) var(--easing);
}

@keyframes heart-pop {
  50% {
    transform: scale(1.4);
  }
  100% {
    transform: scale(1);
  }
}
</style>
