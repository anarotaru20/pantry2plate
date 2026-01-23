<template>
  <BaseDialog
    :model-value="modelValue"
    :title="mode === 'add' ? 'Add location' : 'Edit location'"
    :max-width="480"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-text-field v-model="form.name" label="Location name" variant="outlined" rounded="xl" />
    <v-select v-model="form.room" :items="roomItems" label="Room" variant="outlined" rounded="xl" />
    <v-select
      v-model="form.light"
      :items="lightItems"
      item-title="title"
      item-value="value"
      label="Light"
      variant="outlined"
      rounded="xl"
    />
    <v-textarea v-model="form.notes" label="Notes" rows="3" variant="outlined" rounded="xl" />

    <template #actions>
      <v-btn variant="text" rounded="xl" @click="emit('update:modelValue', false)">Cancel</v-btn>
      <v-btn rounded="xl" variant="flat" @click="emit('save')">
        Save
        <v-icon end>mdi-check</v-icon>
      </v-btn>
    </template>
  </BaseDialog>
</template>

<script setup>
import BaseDialog from './BaseDialog.vue'

const props = defineProps({
  modelValue: Boolean,
  mode: String,
  form: Object,
})

const emit = defineEmits(['update:modelValue', 'save'])

const roomItems = ['Living room', 'Bedroom', 'Kitchen', 'Balcony', 'Bathroom', 'Office']

const lightItems = [
  { title: 'Low light', value: 'low', icon: 'mdi-weather-night' },
  { title: 'Medium light', value: 'medium', icon: 'mdi-weather-partly-cloudy' },
  { title: 'Bright light', value: 'bright', icon: 'mdi-weather-sunny' },
]
</script>
