<template>
  <BaseDialog
    :model-value="modelValue"
    :title="mode === 'add' ? 'Add location' : 'Edit location'"
    :subtitle="
      mode === 'add'
        ? 'Set details before adding this location to your collection.'
        : 'Update this location’s details and save your changes.'
    "
    :max-width="480"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-form v-model="isFormValid" validate-on="input">
      <v-text-field
        v-model="form.name"
        label="Location name"
        variant="outlined"
        rounded="xl"
        class="mb-4"
        :rules="[rules.requiredMin3('Location name')]"
      />

      <v-select
        v-model="form.room"
        :items="roomItems"
        label="Room"
        variant="outlined"
        rounded="xl"
        class="mb-4"
        :rules="[rules.required('Room')]"
      />

      <v-select
        v-model="form.light"
        :items="lightItems"
        item-title="title"
        item-value="value"
        label="Light"
        variant="outlined"
        rounded="xl"
        class="mb-4"
        :rules="[rules.required('Light')]"
      />

      <v-textarea
        v-model="form.notes"
        label="Notes"
        rows="3"
        variant="outlined"
        rounded="xl"
        class="mb-2"
      />
    </v-form>

    <template #actions>
      <div class="actions-bar">
        <v-btn
          variant="outlined"
          rounded="xl"
          class="btn-back"
          @click="emit('update:modelValue', false)"
        >
          Back
        </v-btn>

        <v-btn rounded="xl" class="btn-primary" :disabled="!isFormValid" @click="emit('save')">
          <v-icon start size="18">mdi-check</v-icon>
          {{ mode === 'add' ? 'Add' : 'Update' }}
        </v-btn>
      </div>
    </template>
  </BaseDialog>
</template>

<script setup>
import { computed, ref } from 'vue'
import BaseDialog from './BaseDialog.vue'
import { isValidLocationName } from '@/utils/validators'

defineProps({
  modelValue: Boolean,
  mode: String,
  form: Object,
  roomItems: { type: Array, default: () => [] },
  lightItems: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:modelValue', 'save'])

const isFormValid = ref(false)

const rules = computed(() => ({
  required: (label) => (v) => (!!String(v ?? '').trim() ? true : `${label} is required`),
  requiredMin3: (label) => (v) =>
    isValidLocationName(String(v ?? '')) ? true : `${label} must be at least 3 characters`,
}))
</script>

<style scoped>
.actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-back {
  border-radius: 999px !important;
  font-weight: 800;
  padding: 6px 18px;
}

.btn-primary {
  background: #2e7d32;
  color: white;
  font-weight: 900;
  padding: 10px 22px;
  border-radius: 999px !important;
}

.btn-primary:hover {
  background: #7bb77a;
}

.btn-primary:disabled {
  background: #cfe6cf;
  color: white;
}
</style>
