<script setup>
import { computed, ref } from 'vue'
import LocationDialog from '@/components/dialog/LocationDialog.vue'
import BaseCard from '@/components/BaseCard.vue'

const q = ref('')
const sortBy = ref('name')

const dialog = ref(false)
const mode = ref('add')
const selected = ref(null)

const form = ref({
  name: '',
  room: 'Living room',
  light: 'medium',
  notes: '',
})

const roomItems = ['Living room', 'Bedroom', 'Kitchen', 'Balcony', 'Bathroom', 'Office']
const lightItems = [
  { title: 'Low light', value: 'low', icon: 'mdi-weather-night' },
  { title: 'Medium light', value: 'medium', icon: 'mdi-weather-partly-cloudy' },
  { title: 'Bright light', value: 'bright', icon: 'mdi-weather-sunny' },
]

const locations = ref([
  {
    id: 'l1',
    name: 'Living room',
    room: 'Living room',
    light: 'bright',
    notes: 'South window. Best spot for sun lovers.',
    plantsCount: 6,
  },
  {
    id: 'l2',
    name: 'Kitchen corner',
    room: 'Kitchen',
    light: 'medium',
    notes: 'Warm and cozy. Keep herbs close.',
    plantsCount: 3,
  },
  {
    id: 'l3',
    name: 'Balcony',
    room: 'Balcony',
    light: 'bright',
    notes: 'Windy sometimes. Watch the temperature.',
    plantsCount: 4,
  },
  {
    id: 'l4',
    name: 'Bedroom shelf',
    room: 'Bedroom',
    light: 'low',
    notes: 'Low light. Great for ZZ / snake plant.',
    plantsCount: 2,
  },
])

const iconByLight = (l) =>
  l === 'low'
    ? 'mdi-weather-night'
    : l === 'medium'
      ? 'mdi-weather-partly-cloudy'
      : 'mdi-weather-sunny'

const labelByLight = (l) =>
  l === 'low' ? 'Low light' : l === 'medium' ? 'Medium light' : 'Bright light'

const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()

  const list = locations.value.filter((x) => {
    if (!term) return true
    return (
      x.name.toLowerCase().includes(term) ||
      (x.room || '').toLowerCase().includes(term) ||
      (x.notes || '').toLowerCase().includes(term)
    )
  })

  if (sortBy.value === 'plants')
    return [...list].sort((a, b) => (b.plantsCount || 0) - (a.plantsCount || 0))
  if (sortBy.value === 'light')
    return [...list].sort((a, b) => (a.light || '').localeCompare(b.light || ''))
  return [...list].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
})

const openAdd = () => {
  mode.value = 'add'
  selected.value = null
  form.value = { name: '', room: 'Living room', light: 'medium', notes: '' }
  dialog.value = true
}

const openEdit = (loc) => {
  mode.value = 'edit'
  selected.value = loc
  form.value = {
    name: loc.name || '',
    room: loc.room || 'Living room',
    light: loc.light || 'medium',
    notes: loc.notes || '',
  }
  dialog.value = true
}

const save = () => {
  const payload = {
    name: form.value.name.trim(),
    room: form.value.room,
    light: form.value.light,
    notes: form.value.notes.trim(),
  }

  if (!payload.name) return

  if (mode.value === 'add') {
    locations.value.unshift({
      id: `l_${Math.random().toString(16).slice(2)}`,
      ...payload,
      plantsCount: 0,
    })
  } else if (selected.value) {
    const idx = locations.value.findIndex((x) => x.id === selected.value.id)
    if (idx !== -1) {
      locations.value[idx] = {
        ...locations.value[idx],
        ...payload,
      }
    }
  }

  dialog.value = false
  selected.value = null
}

const removeLoc = (loc) => {
  locations.value = locations.value.filter((x) => x.id !== loc.id)
}
</script>

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
          { title: 'Sort: Plants count', value: 'plants' },
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

    <v-row dense class="grid" style="row-gap: 12px">
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
              {{ labelByLight(loc.light) }}
            </v-chip>

            <v-chip size="small" variant="flat">
              <v-icon start size="16">mdi-sprout</v-icon>
              {{ loc.plantsCount }} plants
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

    <LocationDialog v-model="dialog" :mode="mode" :form="form" @save="save" />
  </div>
</template>

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

.loc-card {
  padding: 14px 14px 12px;
  border: 1px solid rgba(15, 23, 42, 0.06);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.74));
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.loc-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.loc-name {
  font-weight: 950;
  letter-spacing: -0.2px;
  font-size: 1.05rem;
}

.loc-room {
  margin-top: 4px;
  opacity: 0.7;
  font-weight: 800;
  font-size: 0.9rem;
}

.kebab {
  opacity: 0.85;
}

.menu {
  border-radius: 14px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.chip {
  border-radius: 999px;
  font-weight: 850;
  background: rgba(15, 23, 42, 0.06);
}

.notes {
  margin-top: 10px;
  opacity: 0.75;
  font-weight: 700;
  line-height: 1.25rem;
}

.cta {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.btn {
  font-weight: 900;
}

.dlg {
  padding: 14px 14px 12px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.92);
}

.dlg-hdr {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.dlg-title {
  font-weight: 950;
  letter-spacing: -0.2px;
  font-size: 1.1rem;
}

.dlg-body {
  margin-top: 12px;
  display: grid;
  gap: 10px;
}

.field {
  background: rgba(255, 255, 255, 0.78);
  border-radius: 18px;
}

.sel-row {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 850;
}

.dlg-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.ghost {
  font-weight: 900;
  opacity: 0.85;
}

.primary {
  font-weight: 950;
  border-radius: 999px;
}

@media (max-width: 960px) {
  .controls {
    grid-template-columns: 1fr;
  }
}
</style>
