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
        :items="sortItems"
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

    <div v-else-if="filtered.length === 0" class="empty">
      <div class="empty-ico">
        <v-icon size="34">mdi-map-marker-outline</v-icon>
      </div>
      <div class="empty-title">No locations yet</div>
      <div class="empty-sub">Add your first location to organize your plants.</div>
      <v-btn rounded="xl" variant="outlined" class="mt-3" @click="openAdd">
        <v-icon start>mdi-plus</v-icon>
        Add location
      </v-btn>
    </div>

    <v-row v-else dense class="grid" style="row-gap: 12px">
      <v-col v-for="loc in filtered" :key="loc.id" cols="12" sm="6" md="4" lg="4">
        <BaseCard :title="loc.name" :subtitle="loc.room">
          <template #chips>
            <v-chip size="small" variant="flat" :class="['light-chip', lightClass(loc.light)]">
              <v-icon start size="16">{{ iconByLight(loc.light) }}</v-icon>
              {{ loc.light || '—' }}
            </v-chip>
          </template>

          <div class="notes">
            {{ (loc.notes || '').trim() || 'No description' }}
          </div>

          <template #menu>
            <div class="card-actions-top">
              <v-btn size="small" variant="text" class="btn-edit" @click="openEdit(loc)">
                <v-icon start size="16">mdi-pencil</v-icon>
                Edit
              </v-btn>

              <v-btn size="small" variant="text" class="btn-delete" @click="removeLoc(loc)">
                <v-icon start size="16">mdi-delete</v-icon>
                Delete
              </v-btn>
            </div>
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
import { computed, onMounted, ref } from 'vue'
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

const DEFAULT_FORM = Object.freeze({
  name: '',
  room: 'Living room',
  light: 'Medium light',
  notes: '',
})

const form = ref({ ...DEFAULT_FORM })

const roomItems = ['Living room', 'Bedroom', 'Kitchen', 'Balcony', 'Bathroom', 'Office']

const lightItems = [
  { title: 'Low light', value: 'Low light', icon: 'mdi-weather-night' },
  { title: 'Medium light', value: 'Medium light', icon: 'mdi-weather-partly-cloudy' },
  { title: 'Bright light', value: 'Bright light', icon: 'mdi-weather-sunny' },
  { title: 'Direct light', value: 'Direct light', icon: 'mdi-white-balance-sunny' },
]

const sortItems = [
  { title: 'Sort: Name', value: 'name' },
  { title: 'Sort: Room', value: 'room' },
  { title: 'Sort: Light', value: 'light' },
]

const LIGHT_CLASS = {
  'Low light': 'low',
  'Medium light': 'medium',
  'Bright light': 'bright',
  'Direct light': 'direct',
}

const LIGHT_ICON = {
  'Low light': 'mdi-weather-night',
  'Medium light': 'mdi-weather-partly-cloudy',
  'Bright light': 'mdi-weather-sunny',
  'Direct light': 'mdi-white-balance-sunny',
}

const lightClass = (l) => LIGHT_CLASS[l] || ''
const iconByLight = (l) => LIGHT_ICON[l] || 'mdi-weather-partly-cloudy'

const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()
  const list = (locations.value || []).filter((x) => {
    if (!term) return true
    return [x.name, x.room, x.notes, x.light].some((v) => (v || '').toLowerCase().includes(term))
  })

  const key = sortBy.value
  return [...list].sort((a, b) => (a?.[key] || '').localeCompare(b?.[key] || ''))
})

const openAdd = () => {
  mode.value = 'add'
  selected.value = null
  form.value = { ...DEFAULT_FORM }
  dialog.value = true
}

const openEdit = (loc) => {
  mode.value = 'edit'
  selected.value = loc
  form.value = {
    name: loc?.name || '',
    room: loc?.room || DEFAULT_FORM.room,
    light: loc?.light || DEFAULT_FORM.light,
    notes: loc?.notes || '',
  }
  dialog.value = true
}

const normalizeLight = (v) => {
  if (typeof v === 'object' && v) return v.value || v.title || ''
  return v || ''
}

const save = async () => {
  const payload = {
    name: (form.value.name || '').trim(),
    room: form.value.room,
    light: normalizeLight(form.value.light),
    notes: (form.value.notes || '').trim(),
  }

  if (!payload.name || !payload.room || !payload.light) return

  if (mode.value === 'add') await store.addLocation(payload)
  else if (selected.value?.id) await store.updateLocation(selected.value.id, payload)

  dialog.value = false
  selected.value = null
}

const removeLoc = async (loc) => {
  if (!loc?.id) return
  await store.deleteLocation(loc.id)
}

onMounted(() => store.fetchLocations())
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
  font-weight: 700;
  /* background: #2e7d32;
  color: white; */
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

.empty {
  margin-top: 40px;
  border: 1px dashed rgba(15, 23, 42, 0.18);
  border-radius: 18px;
  padding: 22px;
  background: rgba(255, 255, 255, 0.7);
  text-align: center;
}

.empty-ico {
  width: 56px;
  height: 56px;
  margin: 0 auto;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.06);
}

.empty-title {
  margin-top: 10px;
  font-weight: 950;
  font-size: 1.05rem;
}

.empty-sub {
  margin-top: 6px;
  opacity: 0.72;
  font-weight: 700;
}

@media (max-width: 960px) {
  .controls {
    grid-template-columns: 1fr;
  }
}

.notes {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.5;
  font-style: italic;
}

.card-actions-top {
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn-edit,
.btn-delete {
  border-radius: 999px !important;
  padding: 6px 12px;
  font-weight: 900;
  letter-spacing: 0.2px;
  text-transform: none;
  min-width: auto;
}

.btn-edit {
  color: #2563eb;
}

.btn-delete {
  color: #dc2626;
}

.btn-edit:hover {
  background: rgba(37, 99, 235, 0.08);
}

.btn-delete:hover {
  background: rgba(220, 38, 38, 0.08);
}

.light-chip {
  font-weight: 800;
  border-radius: 999px;
  padding: 4px 10px;
}

.light-chip.low {
  background: rgba(59, 130, 246, 0.12);
  color: #1e40af;
}

.light-chip.medium {
  background: rgba(234, 179, 8, 0.18);
  color: #854d0e;
}

.light-chip.bright {
  background: rgba(249, 115, 22, 0.18);
  color: #9a3412;
}

.light-chip.direct {
  background: rgba(38, 220, 99, 0.18);
  color: #1b994f;
}
</style>
