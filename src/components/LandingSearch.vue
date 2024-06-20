<script setup lang="ts">

</script>

<template>
  <div class="input-group">
    <input type="text" required>
    <label for="">
      <i class="bi bi-search"></i>
      <span>Search for a song to discover more</span>
    </label>
  </div>
</template>

<style scoped>
.bi-search {
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
  color: white;
}

.input-group {
  z-index: 1111;
  height: 7vh;
  position: relative;
  margin: 0 40px;
  display: flex;
  flex-direction: row;
  width: 70%;
}

.input-group label {
  position: absolute;
  top: 50%;
  left: .6rem;
  transform: translateY(-50%);
  font-size: 1.3rem;
  color: white;
  padding: 0 5px;
  pointer-events: none;
  transition: .3s;
  display: flex;
  flex-direction: row;
}

.input-group input {
  width: stretch;
  font-size: 1.3rem;
  color: #fff;
  padding: 0 30px;
  background: transparent;
  border: 1.2px solid white;
  outline: none;
  border-radius: .5rem;
}

.input-group input:focus ~ label,
.input-group input:valid ~ label {
  top: 0;
  font-size: .8rem;
  background-color: var(--secondary-colour);
}

.input-group input:focus ~ label i,
.input-group input:valid ~ label i {
  margin-right: 0.35rem;
}

.input-group input:focus,
.input-group input:valid {
  padding-left: 1rem;
  font-size: 1.4rem;
}

@media(max-width: 1050px) {
  .input-group input+label {
    font-size: 1rem;
  }

  .input-group input:focus,
  .input-group input:valid {
    padding-left: 1rem;
    font-size: 1.1rem;
  }
}

@media(min-width: 2000px) {
  .input-group input+label {
    font-size: 1.4rem;
  }

  .input-group input:focus,
  .input-group input:valid {
    padding-left: 1rem;
    font-size: 1.8rem;
  }

  .input-group input:focus ~ label,
  .input-group input:valid ~ label {
    font-size: 1rem;
  }
}
</style>