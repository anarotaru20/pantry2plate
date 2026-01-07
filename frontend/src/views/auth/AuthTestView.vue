<script setup>
import { ref } from "vue"
import { login, register, getProfile } from "../../services/auth"

const email = ref("")
const password = ref("")
const result = ref(null)
const err = ref("")

async function onRegister() {
  err.value = ""
  result.value = null
  try {
    const data = await register(email.value, password.value)
    result.value = { action: "register", data, jwt: localStorage.getItem("jwt") }
  } catch (e) {
    err.value = e?.message || "Register failed"
  }
}

async function onLogin() {
  err.value = ""
  result.value = null
  try {
    const data = await login(email.value, password.value)
    result.value = { action: "login", data, jwt: localStorage.getItem("jwt") }
  } catch (e) {
    err.value = e?.message || "Login failed"
  }
}

async function onProfile() {
  err.value = ""
  result.value = null
  try {
    const data = await getProfile()
    result.value = { action: "profile", data }
  } catch (e) {
    err.value = e?.message || "Profile failed"
  }
}

</script>

<template>
  <div style="max-width: 520px; margin: 40px auto; font-family: sans-serif;">
    <h2>Auth test</h2>

    <div v-if="err" style="color: #b00020; margin-bottom: 12px;">{{ err }}</div>

    <div style="display: grid; gap: 10px;">
      <input v-model="email" placeholder="email" />
      <input v-model="password" placeholder="password" type="password" />

      <button @click="onRegister">Register</button>
      <button @click="onLogin">Login</button>

      <button @click="onProfile">Get profile</button>

    </div>

    <pre style="margin-top: 20px; background: #f6f6f6; padding: 12px; border-radius: 8px;">{{ result }}</pre>
  </div>
</template>
