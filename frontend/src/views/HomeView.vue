<script setup>
import AutoCardCarousel from '../components/AutoCardCarousel.vue'

const carouselItems = [
  { title: 'Track your pantry', text: 'Organize ingredients, quantities, and expiration dates.' },
  { title: 'Add items fast', text: 'Quickly log what you have in your pantry or fridge.' },
  { title: 'Get recipe matches', text: 'Discover recipes based on available ingredients.' },
  { title: 'Smart recommendations', text: 'Filter recipes by preferences and diet.' },
  { title: 'Auto shopping list', text: 'Generate a list with missing ingredients.' },
  { title: 'Buy only what you need', text: 'Your list updates automatically as your pantry changes.' },
]

const stats = [
  { value: '3x', label: 'less food waste' },
  { value: '∞', label: 'recipe ideas' },
]
</script>

<template>
  <v-container fluid class="landing">
    <v-row align="center" class="hero-row">
      <v-col cols="12" md="6">
        <div class="hero">
          <v-img src="/logo.png" max-width="260" class="logo mb-5" />

          <div class="hero-title">
            From <span class="green">Pantry</span> to <span class="orange">Plate</span>.
          </div>

          <div class="hero-subtitle">
            Pantry2Plate helps you track ingredients, discover recipe matches, and build a smart shopping
            list.
          </div>

          <div class="d-flex ga-3 flex-wrap mt-6">
            <v-btn size="large" color="primary" to="/register" class="cta">Start free</v-btn>
            <v-btn size="large" variant="outlined" color="primary" to="/login">
              I already have an account
            </v-btn>
          </div>

          <div class="stats mt-7">
            <div
              v-for="(s, i) in stats"
              :key="s.label"
              class="stat"
              :style="{ animationDelay: `${320 + i * 120}ms` }"
            >
              <div class="stat-value">{{ s.value }}</div>
              <div class="stat-label">{{ s.label }}</div>
            </div>
          </div>
        </div>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="mockup pa-5" elevation="4">
          <div class="d-flex align-center justify-space-between mb-3">
            <div class="text-h6">Preview</div>
            <v-chip size="small" class="chip-soft">Demo UI</v-chip>
          </div>

          <v-row dense>
            <v-col cols="12" sm="6">
              <v-card class="mini" title="Eggs" subtitle="2 pcs" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-card class="mini" title="Milk" subtitle="500 ml" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-card class="mini" title="Pasta" subtitle="1 pack" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-card class="mini" title="Recipes" subtitle="3 matches" />
            </v-col>
          </v-row>

          <v-divider class="my-3" />

          <div class="d-flex ga-2 flex-wrap">
            <v-chip class="chip-green" variant="tonal">Quick add</v-chip>
            <v-chip class="chip-orange" variant="tonal">Smart match</v-chip>
            <v-chip class="chip-red" variant="tonal">Auto list</v-chip>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <AutoCardCarousel title="How it works" :items="carouselItems" numbered :interval-ms="3200" />
  </v-container>
</template>

<style scoped>
.landing {
  min-height: 100vh;
  padding: 64px 24px;
  background:
    radial-gradient(1200px 600px at 18% 0%, rgba(76, 175, 80, 0.12) 0%, transparent 58%),
    radial-gradient(1000px 520px at 82% 16%, rgba(251, 140, 0, 0.12) 0%, transparent 55%),
    radial-gradient(900px 520px at 60% 40%, rgba(229, 57, 53, 0.07) 0%, transparent 60%),
    linear-gradient(180deg, #ffffff, #ffffff);
}

.hero-row {
  margin-bottom: 0;
}

.hero {
  animation: fadeUp 650ms ease both;
}

.hero-title {
  font-size: 2.35rem;
  font-weight: 900;
  line-height: 1.05;
}

.green {
  color: #2e7d32;
}

.orange {
  color: #fb8c00;
}

.hero-subtitle {
  margin-top: 10px;
  font-size: 1.05rem;
  opacity: 0.88;
  max-width: 520px;
}

.cta {
  animation: pulse 2.8s ease-in-out infinite;
}

.mockup {
  border-radius: 20px;
  animation: floatSoft 3.6s ease-in-out infinite;
}

.mini {
  border-radius: 16px;
  transition: transform 200ms ease;
}

.mini:hover {
  transform: translateY(-3px);
}

.stats {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.stat {
  min-width: 132px;
  padding: 10px 12px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  opacity: 0;
  animation: fadeUp 650ms ease both;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 900;
}

.stat-label {
  font-size: 0.85rem;
  opacity: 0.75;
}

.chip-soft {
  background: rgba(46, 125, 50, 0.12);
  color: #2e7d32;
}

.chip-green {
  background: rgba(46, 125, 50, 0.14);
  color: #2e7d32;
}

.chip-orange {
  background: rgba(251, 140, 0, 0.16);
  color: #fb8c00;
}

.chip-red {
  background: rgba(229, 57, 53, 0.14);
  color: #e53935;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes floatSoft {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-7px);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}
</style>
