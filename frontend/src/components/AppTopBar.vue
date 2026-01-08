<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goAddPlant = () => router.push('/plants/new')
</script>

<template>
  <v-toolbar flat class="topbar">
    <v-toolbar-title class="title">test</v-toolbar-title>
    <v-spacer />
    <!-- <v-btn variant="flat" color="green" prepend-icon="mdi-plus" @click="goAddPlant">
      add plant
    </v-btn> -->
  </v-toolbar>
</template>

<style scoped>
.topbar {
  background: transparent;
  padding: 10px 8px;
}

.title {
  font-weight: 900;
}
</style>
