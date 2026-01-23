<template>
  <v-layout class="app-shell">
    <AppSide />

    <v-main class="main">
      <AppTopbar />
      <div class="content">
        <router-view />
      </div>
    </v-main>
  </v-layout>
</template>

<script setup>
import AppSide from '../AppSidebar.vue'
import AppTopbar from '../AppTopBar.vue'
</script>

<style scoped>
.app-shell {
  height: 100vh;
  overflow: hidden;
}

.main {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 12px 70px 24px;
}
</style>
