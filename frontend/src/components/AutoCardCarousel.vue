<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  items: { type: Array, required: true },
  intervalMs: { type: Number, default: 3200 },
  numbered: { type: Boolean, default: false }
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

<template>
  <section class="cf">
    <h2 class="cf-title">{{ title }}</h2>

    <div class="cf-stage" v-if="count">
      <div class="cf-card cf-left" @click="prev">
        <div v-if="numbered" class="cf-badge">{{ prevIndex + 1 }}</div>
        <div class="cf-card-title">{{ list[prevIndex].title }}</div>
        <div class="cf-card-text">{{ list[prevIndex].text }}</div>
      </div>

      <div class="cf-card cf-center">
        <div v-if="numbered" class="cf-badge">{{ active + 1 }}</div>
        <div class="cf-card-title">{{ list[active].title }}</div>
        <div class="cf-card-text">{{ list[active].text }}</div>
      </div>

      <div class="cf-card cf-right" @click="next">
        <div v-if="numbered" class="cf-badge">{{ nextIndex + 1 }}</div>
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

<style scoped>
.cf {
  margin: 18px 0 22px;
  text-align: center;
}

.cf-title {
  font-size: 1.25rem;
  font-weight: 900;
  margin-bottom: 12px;
}

/* STAGE */
.cf-stage {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 170px;
}

.cf-card {
  position: absolute;
  width: min(760px, 92%);
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 14px 30px rgba(0,0,0,0.08);
  transition: transform 420ms ease, opacity 420ms ease;
}

.cf-center {
  transform: scale(1);
  z-index: 3;
}

.cf-left {
  transform: translateX(-44%) scale(0.88);
  opacity: 0.42;
  cursor: pointer;
}

.cf-right {
  transform: translateX(44%) scale(0.88);
  opacity: 0.42;
  cursor: pointer;
}

.cf-badge {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-weight: 900;
  font-size: 0.85rem;
  color: #fff;
  background: linear-gradient(90deg, #ec407a, #fb8c00);
  margin: 0 auto 10px;
}

.cf-card-title {
  font-size: 1.05rem;
  font-weight: 900;
  margin-bottom: 6px;
}

.cf-card-text {
  font-size: 0.95rem;
  opacity: 0.85;
  line-height: 1.45;
}

/* CONTROLS */
.cf-controls {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.cf-arrow {
  background: none;
  border: none;
  font-size: 1.15rem;
  cursor: pointer;
  opacity: 0.55;
  padding: 6px 8px;
}

.cf-arrow:hover {
  opacity: 1;
}

.cf-dots {
  display: flex;
  gap: 8px;
}

.cf-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  border: none;
  background: #000;
  opacity: 0.22;
  cursor: pointer;
}

.cf-dot.active {
  opacity: 1;
  transform: scale(1.25);
}

@media (max-width: 900px) {
  .cf-stage {
    min-height: 190px;
  }

  .cf-card {
    width: min(640px, 92%);
  }

  .cf-left,
  .cf-right {
    opacity: 0.18;
    transform: translateX(-26%) scale(0.94);
  }

  .cf-right {
    transform: translateX(26%) scale(0.94);
  }
}
</style>
