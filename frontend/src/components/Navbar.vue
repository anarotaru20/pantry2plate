<template>
  <v-app-bar class="topbar" elevation="0">
    <v-container class="bar-inner">
      <div class="brand">
        <v-img src="/logo_txt.png" class="brand-logo" contain />
        <div class="brand-text">
          <div class="brand-name">Seed2Bloom</div>
          
        </div>
      </div>

      <v-spacer />

      <slot name="actions" />
    </v-container>
  </v-app-bar>
</template>

<script setup></script>

<style scoped>
.topbar {
  height: var(--appbar-h);
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  margin-bottom: 50px;
}

.bar-inner {
  display: flex;
  align-items: center;
  height: 72px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo {
  width: 55px;
  height: 55px;
}

.brand-name {
  font-weight: 950;
  font-size: 1.12rem;
}
</style>