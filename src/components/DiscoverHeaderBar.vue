<script setup lang="ts">
import UserFlow from './UserFlow.vue';
import DiscoverSearch from './DiscoverSearch.vue';

</script>

<template>
  <div class="bar-parent">
    <div class="bar-left">
      
    </div>

    <div class="bar-mid">
      <DiscoverSearch />
    </div>

    <div class="bar-right">
      <div class="user-flow-container">
        <UserFlow />
      </div>
    </div>
  </div>
</template>

<style scoped>
.bar-parent {
  padding-top: 2vh;
  display: flex;
  flex-direction: row;
}

.bar-mid {
  width: 50vw;
  display: flex;
  flex-direction: row;
}

.bar-left, .bar-right {
  width: 25vw;
}

.user-flow-container {
  min-width: 160px;
  width: 8.5vw;
  margin-right: 1.5vw;
  margin-left: auto;
}

@media (max-width: 1400px) {
  .bar-left, .bar-right {
    width: 20vw;
  }

  .bar-mid {
    width: 60vw;
  }
}
</style>