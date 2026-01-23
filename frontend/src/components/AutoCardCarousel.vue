<template>
  <section class="cf">
    <h2 class="cf-title">{{ title }}</h2>

    <div class="cf-stage" v-if="count">
      <div class="cf-card cf-left" @click="prev">
        <div v-if="list[prevIndex]?.icon" class="cf-badge">
          <v-icon size="18">{{ list[prevIndex].icon }}</v-icon>
        </div>
        <div class="cf-card-title">{{ list[prevIndex].title }}</div>
        <div class="cf-card-text">{{ list[prevIndex].text }}</div>
      </div>

      <div class="cf-card cf-center">
        <div v-if="list[active]?.icon" class="cf-badge">
          <v-icon size="18">{{ list[active].icon }}</v-icon>
        </div>
        <div class="cf-card-title">{{ list[active].title }}</div>
        <div class="cf-card-text">{{ list[active].text }}</div>
      </div>

      <div class="cf-card cf-right" @click="next">
        <div v-if="list[nextIndex]?.icon" class="cf-badge">
          <v-icon size="18">{{ list[nextIndex].icon }}</v-icon>
        </div>
        <div class="cf-card-title">{{ list[nextIndex].title }}</div>
        <div class="cf-card-text">{{ list[nextIndex].text }}</div>
      </div>
    </div>

    <div class="cf-controls" v-if="count > 1">
      <button class="cf-arrow" @click="prev">←</button>

      <div class="cf-dots">
        <button
          v-for="(_, i) in list"
          :key="i"
          class="cf-dot"
          :class="{ active: i === active }"
          @click="setActive(i)"
        />
      </div>

      <button class="cf-arrow" @click="next">→</button>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  items: { type: Array, required: true },
  intervalMs: { type: Number, default: 3200 },
})

const active = ref(0)
let timer = null

const list = computed(() => props.items || [])
const count = computed(() => list.value.length)

const norm = (i) => ((i % count.value) + count.value) % count.value

const prevIndex = computed(() => norm(active.value - 1))
const nextIndex = computed(() => norm(active.value + 1))

const setActive = (i) => {
  active.value = norm(i)
  restart()
}

const next = () => setActive(active.value + 1)
const prev = () => setActive(active.value - 1)

const restart = () => {
  if (timer) clearInterval(timer)
  if (count.value > 1) timer = setInterval(next, props.intervalMs)
}

onMounted(restart)
onBeforeUnmount(() => timer && clearInterval(timer))
</script>

<style scoped>
.cf {
  margin: 0;
  text-align: center;
}

.cf-title {
  font-size: 1.15rem;
  font-weight: 800;
  margin-bottom: 8px;
}

.cf-stage {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 140px;
}

.cf-card {
  position: absolute;
  width: min(440px, 88%);
  padding: 14px 18px;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.08);
  transition:
    transform 420ms ease,
    opacity 420ms ease;
}

.cf-center {
  z-index: 3;
  transform: scale(1);
  opacity: 1;
}

.cf-left {
  transform: translateX(-46%) scale(0.9);
  opacity: 0.35;
  cursor: pointer;
}

.cf-right {
  transform: translateX(46%) scale(0.9);
  opacity: 0.35;
  cursor: pointer;
}

.cf-badge {
  width: 26px;
  height: 26px;
  border-radius: 5px;
  display: grid;
  place-items: center;
  background: #2e7d32;
  color: #fff;
  margin: 0 auto 8px;
}

.cf-card-title {
  font-size: 0.95rem;
  font-weight: 800;
  margin-bottom: 4px;
}

.cf-card-text {
  font-size: 0.88rem;
  opacity: 0.75;
  line-height: 1.4;
}

.cf-controls {
  margin-top: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.cf-arrow {
  background: none;
  border: none;
  font-size: 1.05rem;
  cursor: pointer;
  opacity: 0.45;
}

.cf-arrow:hover {
  opacity: 1;
}

.cf-dots {
  display: flex;
  gap: 6px;
}

.cf-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #000;
  opacity: 0.25;
  border: none;
}

.cf-dot.active {
  opacity: 1;
  transform: scale(1.3);
}
</style>
