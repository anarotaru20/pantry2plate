<template>
  <div class="page">
    <div class="hdr">
      <div>
        <div class="title">Profile</div>
        <div class="sub">Manage your account and preferences</div>
      </div>
    </div>

    <v-alert
      v-if="profileStore.error"
      type="error"
      variant="tonal"
      rounded="xl"
      class="mb16"
      :text="profileStore.error"
    />

    <v-alert
      v-if="successMsg"
      type="success"
      variant="tonal"
      rounded="xl"
      class="mb16"
      :text="successMsg"
    />

    <v-row dense class="cols">
      <v-col cols="12" md="7" class="col">
        <!-- ACCOUNT -->
        <v-card class="card" rounded="2xl" elevation="0">
          <div class="card-h">
            <div class="left">
              <div class="card-ic"><v-icon>mdi-account</v-icon></div>
              <div>
                <div class="card-t">Account</div>
                <div class="card-s">Edit the essentials</div>
              </div>
            </div>

            <v-btn
              rounded="xl"
              variant="outlined"
              class="btn btn-account"
              :loading="saveLoading"
              :disabled="!canSave || saveLoading"
              @click="saveProfile"
            >
              <v-icon start>mdi-content-save</v-icon>
              Update details
            </v-btn>
          </div>

          <v-divider class="my-6" />

          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="form.displayName"
                label="Display name"
                variant="outlined"
                density="comfortable"
                rounded="xl"
                prepend-inner-icon="mdi-account-circle"
                placeholder="How you want to appear in the app"
                clearable
                :error="displayNameTouched && !isDisplayNameValid"
                :error-messages="
                  displayNameTouched && !isDisplayNameValid ? 'Minimum 3 characters.' : ''
                "
                @blur="displayNameTouched = true"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="form.address"
                label="Address"
                variant="outlined"
                density="comfortable"
                rounded="xl"
                prepend-inner-icon="mdi-map-marker-outline"
                placeholder="City, street, optional"
                clearable
                :error="addressTouched && !isAddressValid"
                :error-messages="addressTouched && !isAddressValid ? 'Minimum 3 characters.' : ''"
                @blur="addressTouched = true"
              />
            </v-col>
          </v-row>
        </v-card>

        <!-- EMAIL -->
        <v-card class="card mt16" rounded="2xl" elevation="0">
          <div class="card-h">
            <div class="left">
              <div class="card-ic info"><v-icon>mdi-email-outline</v-icon></div>
              <div>
                <div class="card-t">Email</div>
                <div class="card-s">Update your sign-in email</div>
              </div>
            </div>

            <v-btn
              rounded="xl"
              variant="outlined"
              class="btn btn-email"
              :loading="emailLoading"
              :disabled="!canUpdateEmail || emailLoading"
              @click="updateEmail"
            >
              <v-icon start>mdi-email-edit-outline</v-icon>
              Update email
            </v-btn>
          </div>

          <v-divider class="my-6" />

          <v-text-field
            v-model="emailDraft"
            label="New email"
            variant="outlined"
            density="comfortable"
            rounded="xl"
            prepend-inner-icon="mdi-email-edit-outline"
            placeholder="name@example.com"
            :error="emailTouched && !isEmailValid"
            :error-messages="
              emailTouched && !isEmailValid
                ? 'Use a valid email (must include @ and .com/.ro/etc).'
                : ''
            "
            @blur="emailTouched = true"
          />
        </v-card>

        <!-- SECURITY -->
        <v-card class="card mt16" rounded="2xl" elevation="0">
          <div class="card-h">
            <div class="left">
              <div class="card-ic warn"><v-icon>mdi-shield-lock-outline</v-icon></div>
              <div>
                <div class="card-t">Security</div>
                <div class="card-s">Change password</div>
              </div>
            </div>

            <v-btn
              rounded="xl"
              variant="outlined"
              class="btn btn-security"
              :loading="passwordLoading"
              :disabled="!canUpdatePassword || passwordLoading"
              @click="updatePassword"
            >
              <v-icon start>mdi-lock-reset</v-icon>
              Update password
            </v-btn>
          </div>

          <v-divider class="my-6" />

          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="newPassword"
                label="New password"
                variant="outlined"
                density="comfortable"
                rounded="xl"
                prepend-inner-icon="mdi-lock-outline"
                :type="showNewPassword ? 'text' : 'password'"
                :append-inner-icon="showNewPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                @click:append-inner="showNewPassword = !showNewPassword"
                :error="newPasswordTouched && !isNewPasswordValid"
                :error-messages="
                  newPasswordTouched && !isNewPasswordValid ? 'Minimum 6 characters.' : ''
                "
                @blur="newPasswordTouched = true"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="confirmPassword"
                label="Confirm password"
                variant="outlined"
                density="comfortable"
                rounded="xl"
                prepend-inner-icon="mdi-lock-check-outline"
                :type="showConfirmPassword ? 'text' : 'password'"
                :append-inner-icon="showConfirmPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                @click:append-inner="showConfirmPassword = !showConfirmPassword"
                :error="confirmTouched && !doPasswordsMatch"
                :error-messages="
                  confirmTouched && !doPasswordsMatch ? 'Passwords do not match.' : ''
                "
                @blur="confirmTouched = true"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <!-- RIGHT -->
      <v-col cols="12" md="5" class="col">
        <v-card class="card" rounded="2xl" elevation="0">
          <div class="card-h">
            <div class="left">
              <div class="card-ic muted"><v-icon>mdi-account</v-icon></div>
              <div>
                <div class="card-t">Account</div>
                <div class="card-s">Profile details</div>
              </div>
            </div>
          </div>

          <v-divider class="my-4" />

          <v-row dense class="details">
            <v-col cols="12">
              <div class="d-item">
                <div class="d-lab">Display name</div>
                <div class="d-val">{{ ro.displayName || '—' }}</div>
              </div>
            </v-col>

            <v-col cols="12" sm="6">
              <div class="d-item">
                <div class="d-lab">First name</div>
                <div class="d-val">{{ ro.firstName || '—' }}</div>
              </div>
            </v-col>

            <v-col cols="12" sm="6">
              <div class="d-item">
                <div class="d-lab">Last name</div>
                <div class="d-val">{{ ro.lastName || '—' }}</div>
              </div>
            </v-col>

            <v-col cols="12" sm="6">
              <div class="d-item">
                <div class="d-lab">Birth date</div>
                <div class="d-val">{{ ro.birthDate || '—' }}</div>
              </div>
            </v-col>

            <v-col cols="12" sm="6">
              <div class="d-item">
                <div class="d-lab">Address</div>
                <div class="d-val">{{ ro.address || '—' }}</div>
              </div>
            </v-col>

            <v-col cols="12">
              <div class="d-item" style="padding-bottom: 15px">
                <div class="d-lab">Email</div>
                <div class="d-val">{{ ro.email || '—' }}</div>
              </div>
            </v-col>
          </v-row>
        </v-card>

        <!-- DANGER -->
        <v-card class="card mt16 danger" rounded="2xl" elevation="0">
          <div class="card-h">
            <div class="left">
              <div class="card-ic danger"><v-icon>mdi-delete-alert-outline</v-icon></div>
              <div>
                <div class="card-t">Danger zone</div>
                <div class="card-s">Delete your account permanently</div>
              </div>
            </div>
          </div>

          <v-divider class="my-4" />

          <div class="rowline">
            <div>
              <div class="rowtitle">Delete account</div>
              <div class="rowdesc" style="padding-bottom: 5px">
                This will permanently remove your profile and all related data.
                <br />
                This action cannot be undone.
              </div>
            </div>

            <v-btn
              rounded="xl"
              variant="outlined"
              class="danger-btn btn-danger"
              :loading="deleting"
              :disabled="deleting"
              @click="deleteDialog = true"
            >
              <v-icon start>mdi-delete</v-icon>
              Delete
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="deleteDialog" width="520">
      <v-card rounded="2xl" class="dlg">
        <v-card-title class="dlg-t">Delete account?</v-card-title>
        <v-card-text class="dlg-s">
          Type <strong>DELETE</strong> to confirm. This action cannot be undone.
          <div class="mt12">
            <v-text-field
              v-model="deleteConfirm"
              label="Confirmation"
              placeholder="Type DELETE"
              variant="outlined"
              density="comfortable"
              rounded="xl"
            />
          </div>
        </v-card-text>
        <v-card-actions class="dlg-a">
          <v-spacer />
          <v-btn rounded="xl" variant="text" :disabled="deleting" @click="deleteDialog = false">
            Cancel
          </v-btn>
          <v-btn
            rounded="xl"
            variant="outlined"
            class="danger-btn btn-danger"
            :loading="deleting"
            :disabled="deleting || deleteConfirm !== 'DELETE'"
            @click="deleteAccount"
          >
            <v-icon start>mdi-delete</v-icon>
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>


<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useProfileStore } from '@/stores/profile'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { getAuth } from 'firebase/auth'
import {
  isValidEmail,
  isStrongPassword,
  doPasswordsMatch as passwordsMatch,
  isValidDisplayName,
  isValidAddress,
} from '@/utils/validators'

const profileStore = useProfileStore()
const authStore = useAuthStore()
const router = useRouter()
const auth = getAuth()

const successMsg = ref('')
const deleting = ref(false)

const deleteDialog = ref(false)
const deleteConfirm = ref('')

const saveLoading = ref(false)
const passwordLoading = ref(false)
const emailLoading = ref(false)

const emailDraft = ref('')

const form = reactive({
  displayName: '',
  address: '',
})

const currentEmail = computed(() => profileStore.profile?.email || auth.currentUser?.email || '')

const ro = computed(() => {
  const p = profileStore.profile || {}
  return {
    displayName: p.displayName || '',
    firstName: p.firstName || '',
    lastName: p.lastName || '',
    birthDate: p.birthDate || '',
    address: p.address || '',
    email: p.email || auth.currentUser?.email || '',
  }
})

const newPassword = ref('')
const confirmPassword = ref('')

const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const newPasswordTouched = ref(false)
const confirmTouched = ref(false)

const displayNameTouched = ref(false)
const addressTouched = ref(false)
const emailTouched = ref(false)

const dnTrim = computed(() => (form.displayName || '').trim())
const adTrim = computed(() => (form.address || '').trim())
const emailTrim = computed(() => (emailDraft.value || '').trim())

const isDisplayNameValid = computed(() => !dnTrim.value || isValidDisplayName(dnTrim.value))
const isAddressValid = computed(() => !adTrim.value || isValidAddress(adTrim.value))
const isEmailValid = computed(() => !emailTrim.value || isValidEmail(emailTrim.value))

const isNewPasswordValid = computed(() => !newPassword.value || isStrongPassword(newPassword.value))
const doPasswordsMatch = computed(() =>
  !confirmPassword.value ? true : passwordsMatch(newPassword.value, confirmPassword.value),
)

const canSave = computed(() => {
  const p = profileStore.profile
  if (!p) return false

  const dn = dnTrim.value
  const ad = adTrim.value

  const dnChanged = dn !== (p.displayName || '')
  const adChanged = ad !== (p.address || '')

  if (dnChanged && dn && !isValidDisplayName(dn)) return false
  if (adChanged && ad && !isValidAddress(ad)) return false

  return dnChanged || adChanged
})

const canUpdatePassword = computed(() => {
  if (!newPassword.value || !confirmPassword.value) return false
  if (!isStrongPassword(newPassword.value)) return false
  return passwordsMatch(newPassword.value, confirmPassword.value)
})

const canUpdateEmail = computed(() => {
  const e = emailTrim.value
  if (!e) return false
  if (e === (currentEmail.value || '').trim()) return false
  return isValidEmail(e)
})

const syncFormFromStore = () => {
  const p = profileStore.profile
  form.displayName = p?.displayName || ''
  form.address = p?.address || ''
  emailDraft.value = p?.email || auth.currentUser?.email || ''
  displayNameTouched.value = false
  addressTouched.value = false
  emailTouched.value = false
}

const saveProfile = async () => {
  displayNameTouched.value = true
  addressTouched.value = true
  if (!isDisplayNameValid.value || !isAddressValid.value) return
  if (!canSave.value) return

  saveLoading.value = true
  successMsg.value = ''
  try {
    const payload = { displayName: dnTrim.value, address: adTrim.value }
    await profileStore.patchProfile(payload)
    syncFormFromStore()
    successMsg.value = 'Profile updated.'
    setTimeout(() => (successMsg.value = ''), 2500)
  } finally {
    saveLoading.value = false
  }
}

const updateEmail = async () => {
  emailTouched.value = true
  if (!emailTrim.value || !isValidEmail(emailTrim.value)) return
  if (!canUpdateEmail.value) return

  emailLoading.value = true
  successMsg.value = ''
  try {
    const idToken = auth.currentUser?.getIdToken ? await auth.currentUser.getIdToken() : ''
    await profileStore.changeEmail(idToken, emailTrim.value)
    syncFormFromStore()
    successMsg.value = 'Email updated.'
    setTimeout(() => (successMsg.value = ''), 2500)
  } finally {
    emailLoading.value = false
  }
}

const updatePassword = async () => {
  newPasswordTouched.value = true
  confirmTouched.value = true
  if (!canUpdatePassword.value) return

  passwordLoading.value = true
  successMsg.value = ''
  try {
    const idToken = auth.currentUser?.getIdToken ? await auth.currentUser.getIdToken() : ''
    await profileStore.changePassword(idToken, newPassword.value)
    newPassword.value = ''
    confirmPassword.value = ''
    newPasswordTouched.value = false
    confirmTouched.value = false
    showNewPassword.value = false
    showConfirmPassword.value = false
    successMsg.value = 'Password updated.'
    setTimeout(() => (successMsg.value = ''), 2500)
  } finally {
    passwordLoading.value = false
  }
}

const deleteAccount = async () => {
  deleting.value = true
  successMsg.value = ''
  try {
    await profileStore.removeAccount()
    authStore.logout()
    deleteConfirm.value = ''
    deleteDialog.value = false
    await router.push('/login')
  } finally {
    deleting.value = false
  }
}

onMounted(async () => {
  if (!profileStore.profile) await profileStore.fetchProfile()
  syncFormFromStore()
})
</script>

<style scoped>
.page {
  padding-top: 6px;
}

.hdr {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.title {
  font-size: 1.6rem;
  font-weight: 900;
  letter-spacing: -0.3px;
}

.sub {
  margin-top: 4px;
  opacity: 0.7;
  font-weight: 700;
}

.btn {
  font-weight: 900;
}

.btn-account {
  background: #2e7d32 !important;
  color: #fff !important;
}

.btn-email {
  background: #2563eb !important;
  color: #fff !important;
}

.btn-security {
  background: #fb8c00 !important;
  color: #fff !important;
}

.btn-danger {
  background: #dc2626 !important;
  color: #fff !important;
}

.btn:disabled {
  opacity: 0.45 !important;
}

.cols {
  align-items: stretch;
}

.col {
  display: flex;
  flex-direction: column;
}

.card {
  padding: 18px 18px 12px;
  border: 1px solid rgba(20, 31, 24, 0.08);
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(10px);
}

.mt16 {
  margin-top: 16px;
}

.card-h {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-ic {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(46, 125, 50, 0.12);
  border: 1px solid rgba(46, 125, 50, 0.18);
}

.card-ic.warn {
  background: rgba(245, 158, 11, 0.12);
  border-color: rgba(245, 158, 11, 0.2);
}

.card-ic.danger {
  background: rgba(239, 68, 68, 0.12);
  border-color: rgba(239, 68, 68, 0.2);
}

.card-ic.info {
  background: rgba(59, 130, 246, 0.12);
  border-color: rgba(59, 130, 246, 0.2);
}

.card-ic.muted {
  background: rgba(18, 23, 38, 0.06);
  border-color: rgba(18, 23, 38, 0.08);
}

.card-t {
  font-weight: 900;
}

.card-s {
  margin-top: 2px;
  font-size: 0.85rem;
  opacity: 0.7;
  font-weight: 700;
}

.hint {
  margin-top: 10px;
  font-size: 0.85rem;
  opacity: 0.75;
  font-weight: 650;
}

.rowline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.rowtitle {
  font-weight: 900;
}

.rowdesc {
  margin-top: 2px;
  font-size: 0.85rem;
  opacity: 0.7;
  font-weight: 650;
}

.details :deep(.v-col) {
  padding-top: 10px;
}

.d-item {
  padding: 6px 2px;
  background: transparent;
  border: none;
}

.d-lab {
  font-size: 0.78rem;
  font-weight: 900;
  opacity: 0.65;
  letter-spacing: 0.3px;
}

.d-val {
  margin-top: 2px;
  font-weight: 950;
  letter-spacing: 0.1px;
  word-break: break-word;
}

.mb16 {
  margin-bottom: 16px;
}
.mb8 {
  margin-bottom: 8px;
}
.mt8 {
  margin-top: 8px;
}
.mt12 {
  margin-top: 12px;
}

.danger {
  border-color: rgba(239, 68, 68, 0.22);
}

.danger-btn {
  border-color: rgba(239, 68, 68, 0.6) !important;
  color: #fff !important;
}

.dlg {
  padding: 10px 10px 6px;
}

.dlg-t {
  font-weight: 950;
}

.dlg-s {
  opacity: 0.9;
  font-weight: 650;
}

.dlg-a {
  padding: 10px 14px 14px;
}
</style>
