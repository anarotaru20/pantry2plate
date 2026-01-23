<template>
  <div class="page">
    <div class="hdr">
      <div>
        <div class="title">Locations</div>
        <div class="sub">Organize your plants by rooms and light</div>
      </div>

      <v-btn rounded="xl" variant="outlined" class="add" @click="openAdd">
        <v-icon start>mdi-plus</v-icon>
        Add location
      </v-btn>
    </div>

    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      density="comfortable"
      rounded="xl"
      class="mb-3"
    >
      {{ error }}
    </v-alert>

    <div class="controls">
      <v-text-field
        v-model="q"
        placeholder="Search locations..."
        variant="outlined"
        density="comfortable"
        rounded="xl"
        prepend-inner-icon="mdi-magnify"
        hide-details
        class="search"
      />

      <v-select
        v-model="sortBy"
        :items="[
          { title: 'Sort: Name', value: 'name' },
          { title: 'Sort: Room', value: 'room' },
          { title: 'Sort: Light', value: 'light' },
        ]"
        item-title="title"
        item-value="value"
        variant="outlined"
        density="comfortable"
        rounded="xl"
        hide-details
        class="sel"
      />
    </div>

    <div v-if="loading" class="py-6 d-flex justify-center">
      <v-progress-circular indeterminate />
    </div>

    <v-row v-else dense class="grid" style="row-gap: 12px">
      <v-col v-for="loc in filtered" :key="loc.id" cols="12" sm="6" md="4" lg="4">
        <BaseCard :title="loc.name" :subtitle="loc.room">
          <template #menu>
            <v-menu location="bottom end">
              <template #activator="{ props }">
                <v-btn v-bind="props" icon variant="text">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list density="compact">
                <v-list-item @click="openEdit(loc)">
                  <template #prepend><v-icon size="18">mdi-pencil</v-icon></template>
                  <v-list-item-title>Edit</v-list-item-title>
                </v-list-item>

                <v-list-item @click="removeLoc(loc)">
                  <template #prepend><v-icon size="18">mdi-delete</v-icon></template>
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>

          <template #chips>
            <v-chip size="small" variant="flat">
              <v-icon start size="16">{{ iconByLight(loc.light) }}</v-icon>
              {{ loc.light || '—' }}
            </v-chip>
          </template>

          {{ loc.notes }}

          <template #actions>
            <v-btn rounded="xl" variant="outlined" @click="openEdit(loc)">
              Manage
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </template>
        </BaseCard>
      </v-col>
    </v-row>

    <LocationDialog
      v-model="dialog"
      :mode="mode"
      :form="form"
      :room-items="roomItems"
      :light-items="lightItems"
      @save="save"
    />
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useLocationsStore } from '@/stores/locations'
import LocationDialog from '@/components/dialog/LocationDialog.vue'
import BaseCard from '@/components/BaseCard.vue'

const store = useLocationsStore()
const { locations, loading, error } = storeToRefs(store)

const q = ref('')
const sortBy = ref('name')

const dialog = ref(false)
const mode = ref('add')
const selected = ref(null)

const form = ref({
  name: '',
  room: 'Living room',
  light: 'Medium light',
  notes: '',
})

const roomItems = ['Living room', 'Bedroom', 'Kitchen', 'Balcony', 'Bathroom', 'Office']
const lightItems = [
  { title: 'Low light', value: 'Low light', icon: 'mdi-weather-night' },
  { title: 'Medium light', value: 'Medium light', icon: 'mdi-weather-partly-cloudy' },
  { title: 'Bright light', value: 'Bright light', icon: 'mdi-weather-sunny' },
  { title: 'Direct light', value: 'Direct light', icon: 'mdi-white-balance-sunny' },
]

const iconByLight = (l) =>
  l === 'Low light'
    ? 'mdi-weather-night'
    : l === 'Medium light'
      ? 'mdi-weather-partly-cloudy'
      : l === 'Bright light'
        ? 'mdi-weather-sunny'
        : l === 'Direct light'
          ? 'mdi-white-balance-sunny'
          : 'mdi-weather-partly-cloudy'

const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()

  const list = (locations.value || []).filter((x) => {
    if (!term) return true
    return (
      (x.name || '').toLowerCase().includes(term) ||
      (x.room || '').toLowerCase().includes(term) ||
      (x.notes || '').toLowerCase().includes(term) ||
      (x.light || '').toLowerCase().includes(term)
    )
  })

  if (sortBy.value === 'light')
    return [...list].sort((a, b) => (a.light || '').localeCompare(b.light || ''))
  if (sortBy.value === 'room')
    return [...list].sort((a, b) => (a.room || '').localeCompare(b.room || ''))
  return [...list].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
})

const openAdd = () => {
  mode.value = 'add'
  selected.value = null
  form.value = { name: '', room: 'Living room', light: 'Medium light', notes: '' }
  dialog.value = true
}

const openEdit = (loc) => {
  mode.value = 'edit'
  selected.value = loc
  form.value = {
    name: loc.name || '',
    room: loc.room || 'Living room',
    light: loc.light || 'Medium light',
    notes: loc.notes || '',
  }
  dialog.value = true
}

const save = async () => {
  const payload = {
    name: form.value.name.trim(),
    room: form.value.room,
    light: form.value.light,
    notes: form.value.notes.trim(),
  }

  if (!payload.name) return
  if (!payload.room) return
  if (!payload.light) return

  if (mode.value === 'add') {
    await store.addLocation(payload)
  } else if (selected.value?.id) {
    await store.updateLocation(selected.value.id, payload)
  }

  dialog.value = false
  selected.value = null
}

const removeLoc = async (loc) => {
  if (!loc?.id) return
  await store.deleteLocation(loc.id)
}

onMounted(async () => {
  await store.fetchLocations()
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
  margin-bottom: 14px;
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

.add {
  font-weight: 900;
}

.controls {
  display: grid;
  grid-template-columns: 1fr 240px;
  gap: 12px;
  margin-bottom: 14px;
}

.search,
.sel {
  background: rgba(255, 255, 255, 0.78);
  border-radius: 18px;
}

.grid {
  margin-top: 2px;
}

@media (max-width: 960px) {
  .controls {
    grid-template-columns: 1fr;
  }
}
</style>
