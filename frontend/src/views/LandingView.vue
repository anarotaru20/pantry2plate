<script setup>
import AutoCardCarousel from '../components/AutoCardCarousel.vue'

const carouselItems = [
  { title: 'Track your pantry', text: 'Organize ingredients, quantities, and expiration dates.' },
  { title: 'Add items fast', text: 'Quickly log what you have in your pantry or fridge.' },
  { title: 'Get recipe matches', text: 'Discover recipes based on available ingredients.' },
  { title: 'Smart recommendations', text: 'Filter recipes by preferences and diet.' },
  { title: 'Auto shopping list', text: 'Generate a list with missing ingredients.' },
  {
    title: 'Buy only what you need',
    text: 'Your list updates automatically as your pantry changes.',
  },
]
</script>

<template>
  <v-container fluid class="landing">
    <v-app-bar class="topbar" elevation="0">
      <v-container class="bar-inner">
        <div class="brand">
          <v-img src="/logotxt.png" class="brand-logo" contain />
          <div class="brand-text">
            <div class="brand-name">Pantry2Plate</div>
          </div>
        </div>

        <v-spacer />

        <div class="actions">
          <v-btn variant="outlined" class="btn-pill btn-orange-outline" to="/login"> Login </v-btn>
          <v-btn class="btn-pill btn-green" to="/register"> Register </v-btn>
        </div>
      </v-container>
    </v-app-bar>

    <v-container class="content">
      <v-row class="hero-row" align="center" no-gutters>
        <v-col cols="12" md="6" class="text-col">
          <div class="hero">
            <div class="pill">Your kitchen, organized.</div>

            <h1 class="hero-title">
              Plan meals, manage ingredients, and cook smarter — in one place.
            </h1>

            <p class="hero-subtitle">
              Pantry2Plate keeps your pantry up to date, recommends recipes based on what you
              already have, and generates a shopping list that makes sense.
            </p>

            <div class="cta">
              <v-btn size="large" class="btn-pill btn-green" to="/register"> Start free </v-btn>
              <v-btn
                size="large"
                variant="outlined"
                class="btn-pill btn-orange-outline"
                to="/login"
              >
                I already have an account
              </v-btn>
            </div>
          </div>
        </v-col>

        <v-col cols="12" md="6" class="image-col">
          <v-img src="/illustration_landing.png" class="illustration" contain eager />
        </v-col>
      </v-row>

      <div class="bottom-band">
        <AutoCardCarousel
          title="How it works"
          :items="carouselItems"
          numbered
          :interval-ms="3200"
        />
      </div>
    </v-container>

    <footer class="footer">
      <span>© 2026 Pantry2Plate</span>
    </footer>
  </v-container>
</template>

<style scoped>
:global(html),
:global(body),
:global(#app),
:global(.v-application) {
  height: 100%;
  overflow: hidden;
}

.landing {
  --appbar-h: 70px;
  --footer-h: 34px;
  height: 100dvh;
  overflow: hidden;
  position: relative;
  background:
    radial-gradient(1200px 700px at 12% 20%, rgba(76, 175, 80, 0.14), transparent 55%),
    radial-gradient(1100px 600px at 88% 22%, rgba(255, 152, 0, 0.16), transparent 58%), #fff;
}

:deep(.landing.v-container) {
  padding: 0 !important;
}

.topbar {
  height: var(--appbar-h);
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.bar-inner {
  max-width: 1440px;
  height: var(--appbar-h);
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo {
  width: 64px;
  height: 45px;
  object-fit: contain;
}

.brand-name {
  font-weight: 950;
  font-size: 1.08rem;
}

.actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn-pill {
  border-radius: 999px;
  text-transform: none;
  font-weight: 850;
  letter-spacing: 0.2px;
}

.btn-green {
  background: #2e7d32;
  color: #fff;
  box-shadow: 0 12px 26px rgba(46, 125, 50, 0.22);
}

.btn-orange-outline {
  border: 2px solid #fb8c00;
  color: #fb8c00;
}

.btn-orange-outline:hover {
  background: rgba(251, 140, 0, 0.1);
}

.content {
  max-width: 1440px;
  height: calc(100dvh - var(--appbar-h));
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0 20px;
  padding-bottom: calc(var(--footer-h) + 10px);
}

.hero-row {
  flex: 1 1 auto;
  min-height: 0;
  align-content: center;
}

.text-col {
  display: flex;
  align-items: center;
  min-height: 0;
}

.hero {
  max-width: 640px;
  animation: fadeUp 600ms ease both;
}

.pill {
  display: inline-flex;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.06);
  font-weight: 800;
  font-size: 0.9rem;
  width: fit-content;
}

.hero-title {
  margin-top: 18px;
  font-size: clamp(2.1rem, 4vw, 3.2rem);
  font-weight: 950;
  line-height: 1.04;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  margin-top: 14px;
  font-size: 1.05rem;
  opacity: 0.82;
  max-width: 560px;
}

.cta {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 22px;
}

.image-col {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  min-height: 0;
}

.illustration {
  width: 100%;
  max-width: 620px;
  max-height: 100%;
  filter: drop-shadow(0 22px 44px rgba(0, 0, 0, 0.12));
  animation: floatSoft 4.5s ease-in-out infinite;
}

.bottom-band {
  flex: 0 0 auto;
  padding: 10px 0 6px;
  overflow: hidden;
  min-height: 0;
}

.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: var(--footer-h);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.82rem;
  font-weight: 700;
  opacity: 0.85;
  backdrop-filter: blur(12px);
  z-index: 9999;
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
    transform: translateY(-6px);
  }
}
</style>
