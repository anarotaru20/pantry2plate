<template>
  <footer class="footer">
    <slot>
      <span>© 2026 Seed2Bloom </span>
    </slot>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  backdrop-filter: blur(12px);
  z-index: 9999;
}
</style>