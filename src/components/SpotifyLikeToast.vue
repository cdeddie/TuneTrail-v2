<script setup lang="ts">
defineProps({
  trackName: String,
  trackImage: String,
  trackArtist: String
});
</script>

<template>
  <div class="custom-toast">
    <img :src="trackImage" class="track-image" />
    <div class="track-info">
      <p class="track-title">Added <strong>{{ trackName }}</strong> to Spotify liked!</p>
      <p class="track-artist">{{ trackArtist }}</p>
    </div>
  </div>
</template>

<style scoped>
.custom-toast {
  display: flex;
  align-items: center;
  max-width: 400px;
}

.track-image {
  width: 6vh;
  border-radius: 4px;
  margin-right: 12px;
}

.track-info {
  display: flex;
  flex-direction: column;
}

.track-title {
  font-size: 14px;
  margin: 0;
}

.track-artist {
  color: rgb(74, 74, 74);
  font-style: italic;
}

strong {
  color: #1db954;
  font-weight: bold;
}
</style>
