<template>
  <div class="app-container">
    <TopNav />

    <div class="banner">
      <SideBar />

      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import SideBar from './components/SideBar.vue'
import TopNav from './components/TopNav.vue'
</script>

<style>
.app-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
}

.banner {
  flex: 1;
  display: flex;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column; 
  gap: 20px;
  padding: 20px;
  min-height: 400px;
}
</style>
