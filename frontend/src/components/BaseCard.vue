<script setup>
defineProps({
  title: String,
  subtitle: String,
})
</script>

<template>
  <v-card class="base-card" variant="flat">
    <div class="top">
      <div class="left">
        <div v-if="title" class="title">{{ title }}</div>
        <div v-if="subtitle" class="subtitle">{{ subtitle }}</div>
      </div>

      <div class="right">
        <slot name="menu" />
      </div>
    </div>

    <div v-if="$slots.chips" class="chips">
      <slot name="chips" />
    </div>

    <div v-if="$slots.default" class="body">
      <slot />
    </div>

    <div v-if="$slots.actions" class="actions">
      <slot name="actions" />
    </div>
  </v-card>
</template>

<style scoped>
.base-card {
  padding: 14px 14px 12px;
  border: 1px solid rgba(15, 23, 42, 0.06);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.78));
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.base-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 38px rgba(15, 23, 42, 0.08);
}

.top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.left {
  min-width: 0;
}

.title {
  font-weight: 950;
  letter-spacing: -0.2px;
  font-size: 1.05rem;
  line-height: 1.2;
}

.subtitle {
  margin-top: 4px;
  opacity: 0.7;
  font-weight: 800;
  font-size: 0.9rem;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.body {
  margin-top: 10px;
  opacity: 0.75;
  font-weight: 700;
  line-height: 1.25rem;
}

.actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
