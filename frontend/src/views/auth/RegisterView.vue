<script setup>
import { ref } from "vue"

const email = ref("")
const password = ref("")
const confirmPassword = ref("")
const message = ref("")
const loading = ref(false)

const handleRegister = async () => {
  message.value = ""
  loading.value = true

  try {
    if (password.value && confirmPassword.value && password.value !== confirmPassword.value) {
      message.value = "Passwords do not match"
      return
    }

    const res = await fetch("http://localhost:5000/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.value, password: password.value })
    })

    const data = await res.json()
    message.value = data.message || "Done"
  } catch (e) {
    message.value = "Error connecting to server"
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-container fluid class="auth">
    <v-row class="auth-row" align="center" justify="center">
      <v-col cols="12" md="6" class="d-none d-md-block">
        <div class="left">
          <v-img src="/logo.png" max-width="220" class="logo mb-6" />

          <div class="title">
            Create your <span class="green">Pantry</span><span class="dot">2</span><span class="orange">Plate</span> account.
          </div>

          <div class="subtitle">
            Start tracking ingredients, matching recipes, and building a smarter grocery list.
          </div>

          <div class="badges mt-6">
            <div class="badge chip-green" style="animation-delay: 240ms">
              <v-icon size="18" class="mr-2">mdi-fridge-outline</v-icon>
              Organize pantry
            </div>
            <div class="badge chip-orange" style="animation-delay: 360ms">
              <v-icon size="18" class="mr-2">mdi-lightbulb-on-outline</v-icon>
              Get suggestions
            </div>
            <div class="badge chip-red" style="animation-delay: 480ms">
              <v-icon size="18" class="mr-2">mdi-cart-outline</v-icon>
              Plan & shop
            </div>
          </div>
        </div>
      </v-col>

      <v-col cols="12" sm="10" md="5" lg="4">
        <v-card class="card" elevation="4">
          <div class="top">
            <v-avatar size="58" color="primary" variant="tonal" class="mb-3">
              <v-icon size="28">mdi-account-plus-outline</v-icon>
            </v-avatar>

            <div class="card-title">Register</div>
            <div class="card-subtitle">Create an account in seconds.</div>
          </div>

          <v-text-field
            v-model="email"
            label="Email"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            rounded="lg"
            class="mb-3"
            autocomplete="email"
          />

          <v-text-field
            v-model="password"
            label="Password"
            prepend-inner-icon="mdi-lock-outline"
            type="password"
            variant="outlined"
            rounded="lg"
            class="mb-3"
            autocomplete="new-password"
          />

          <v-text-field
            v-model="confirmPassword"
            label="Confirm password"
            prepend-inner-icon="mdi-lock-check-outline"
            type="password"
            variant="outlined"
            rounded="lg"
            class="mb-4"
            autocomplete="new-password"
          />

          <v-btn
            color="primary"
            size="large"
            block
            rounded="lg"
            class="cta"
            :loading="loading"
            :disabled="!email"
            @click="handleRegister"
          >
            Create account
            <v-icon end>mdi-arrow-right</v-icon>
          </v-btn>

          <v-alert
            v-if="message"
            class="mt-4"
            variant="tonal"
            :type="message === 'Passwords do not match' ? 'warning' : 'success'"
            rounded="lg"
          >
            {{ message }}
          </v-alert>

          <div class="bottom text-center mt-5">
            <span class="text-medium-emphasis">Already have an account?</span>
            <RouterLink to="/login" class="link-strong">Sign in</RouterLink>
          </div>
        </v-card>

        <div class="mini-note mt-4">
          <v-icon size="18" class="mr-2">mdi-sparkles</v-icon>
          Minimal mock register for now — auth logic comes later.
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.auth {
  min-height: 100vh;
  padding: 64px 24px;
  background:
    radial-gradient(1200px 600px at 18% 0%, rgba(76, 175, 80, 0.12) 0%, transparent 58%),
    radial-gradient(1000px 520px at 82% 16%, rgba(251, 140, 0, 0.12) 0%, transparent 55%),
    radial-gradient(900px 520px at 60% 40%, rgba(229, 57, 53, 0.07) 0%, transparent 60%),
    linear-gradient(180deg, #ffffff, #ffffff);
}

.auth-row {
  min-height: calc(100vh - 128px);
}

.left {
  max-width: 560px;
  animation: fadeUp 650ms ease both;
}

.title {
  font-size: 2.1rem;
  font-weight: 900;
  line-height: 1.05;
}

.subtitle {
  margin-top: 12px;
  font-size: 1.05rem;
  opacity: 0.88;
  max-width: 520px;
}

.green {
  color: #2e7d32;
}

.orange {
  color: #fb8c00;
}

.dot {
  color: #e53935;
  font-weight: 900;
}

.badges {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 16px;
  font-weight: 700;
  opacity: 0;
  animation: fadeUp 650ms ease both;
}

.card {
  border-radius: 22px;
  padding: 22px;
  animation: floatSoft 3.6s ease-in-out infinite;
}

.top {
  text-align: center;
  margin-bottom: 14px;
}

.card-title {
  font-size: 1.55rem;
  font-weight: 900;
}

.card-subtitle {
  font-size: 0.95rem;
  opacity: 0.75;
}

.cta {
  animation: pulse 2.8s ease-in-out infinite;
}

.bottom {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.link-strong {
  text-decoration: none;
  font-weight: 900;
  color: #2e7d32;
}

.mini-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.9rem;
  opacity: 0.8;
  animation: fadeUp 650ms ease both;
  animation-delay: 180ms;
}

.chip-green {
  background: rgba(46, 125, 50, 0.14);
  color: #2e7d32;
  border: 1px solid rgba(46, 125, 50, 0.18);
}

.chip-orange {
  background: rgba(251, 140, 0, 0.16);
  color: #fb8c00;
  border: 1px solid rgba(251, 140, 0, 0.2);
}

.chip-red {
  background: rgba(229, 57, 53, 0.14);
  color: #e53935;
  border: 1px solid rgba(229, 57, 53, 0.18);
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
