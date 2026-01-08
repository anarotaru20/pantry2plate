<script setup>
import AppSide from '../components/AppSidebar.vue'
import AppTopbar from '../components/AppTopBar.vue'
</script>

<template>
  <v-app>
    <v-layout class="app-shell">
      <AppSide />

      <v-main class="main">
        <AppTopbar />
        <div class="content">
          <router-view />
        </div>
      </v-main>
    </v-layout>
  </v-app>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
}
.main {
  background: #f7f8fa;
}
.content {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
