<template>
  <div class="page">
    <div class="hdr">
      <div>
        <div class="title">My plants</div>
        <div class="sub">All your plants in one place</div>
      </div>

      <v-btn rounded="xl" variant="outlined" class="add" @click="openAdd">
        <v-icon start>mdi-plus</v-icon>
        Add plant
      </v-btn>
    </div>

    <div class="controls">
      <v-text-field
        v-model="q"
        placeholder="Search plants..."
        variant="outlined"
        density="comfortable"
        rounded="xl"
        prepend-inner-icon="mdi-magnify"
        hide-details
        class="search"
      />

      <v-select
        v-model="status"
        :items="[
          { title: 'All', value: 'all' },
          { title: 'OK', value: 'ok' },
          { title: 'Today', value: 'today' },
          { title: 'Due soon', value: 'due' },
          { title: 'Needs water', value: 'needs' },
        ]"
        item-title="title"
        item-value="value"
        variant="outlined"
        density="comfortable"
        rounded="xl"
        hide-details
        class="sel"
        label="Status"
      />

      <v-select
        v-model="room"
        :items="roomFilterItems"
        item-title="title"
        item-value="value"
        variant="outlined"
        density="comfortable"
        rounded="xl"
        hide-details
        class="sel"
        label="Room"
      />
    </div>

    <div v-if="plantsStore.loading" class="state">Loading...</div>
    <div v-else-if="plantsStore.error" class="state error">{{ plantsStore.error }}</div>
    <div v-else-if="filtered.length === 0" class="state">No plants yet. Add your first one 🌱</div>

    <PlantCatalogDialog
      v-model="addDialog"
      v-model:search="search"
      v-model:activeTag="activeTag"
      @select="openDetails"
    />

    <PlantDetailsDialog
      v-model="editDialog"
      :mode="'edit'"
      :plant="selectedPlant"
      :form="editForm"
      :locations="locationItems"
      :saving="editSaving"
      @update:form="editForm = $event"
      @back="closeEdit"
      @save="saveEdit"
    />

    <PlantDetailsDialog
      v-model="detailsDialog"
      :mode="'add'"
      :plant="selectedTemplate"
      :form="form"
      :locations="locationItems"
      @update:form="form = $event"
      @back="backToCatalog"
      @save="saveNewPlant"
    />

    <v-dialog v-model="deleteDialog" max-width="420">
      <v-card rounded="2xl">
        <v-card-title class="font-weight-black">Delete plant?</v-card-title>
        <v-card-text>
          This will permanently delete <strong>{{ plantToDelete?.name }}</strong
          >.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn rounded="xl" variant="text" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn
            rounded="xl"
            variant="flat"
            color="red"
            :loading="deleteLoading"
            @click="confirmDelete"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row
      v-if="!plantsStore.loading && !plantsStore.error"
      dense
      class="grid-my-plants"
      style="row-gap: 12px"
    >
      <v-col v-for="p in filtered" :key="p.id" cols="12" sm="6" md="4" lg="4">
        <MyPlantCard :plant="p" @edit="openEdit" @delete="openDelete" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import MyPlantCard from '@/components/MyPlantCard.vue'
import PlantDetailsDialog from '@/components/dialog/PlantDetailsDialog.vue'
import PlantCatalogDialog from '@/components/dialog/PlantCatalogDialog.vue'
import { usePlantsStore } from '@/stores/plants'
import { useLocationsStore } from '@/stores/locations'

const plantsStore = usePlantsStore()
const locationsStore = useLocationsStore()
const { locations: userLocations } = storeToRefs(locationsStore)

const q = ref('')
const status = ref('all')
const room = ref('all')

const addDialog = ref(false)
const detailsDialog = ref(false)
const selectedTemplate = ref(null)

const search = ref('')
const activeTag = ref('all')

const form = ref({
  location: '',
  waterEveryDays: 3,
  notes: '',
  photoUrl: '',
})

const roomItems = ['Living room', 'Bedroom', 'Kitchen', 'Balcony', 'Bathroom', 'Office']

onMounted(async () => {
  await Promise.all([plantsStore.fetchPlants(), locationsStore.fetchLocations?.()])
})

const locationItems = computed(() => {
  const names = (userLocations.value || [])
    .map((l) => (typeof l === 'string' ? l : l?.name))
    .filter(Boolean)
    .map((v) => String(v).trim())
    .filter(Boolean)

  const uniq = Array.from(new Set(names))
  return uniq.length ? uniq : roomItems
})

const roomFilterItems = computed(() => [
  { title: 'All', value: 'all' },
  ...roomItems.map((x) => ({ title: x, value: x })),
])

const roomByLocationName = computed(() => {
  const m = new Map()
  for (const l of userLocations.value || []) {
    if (!l) continue
    const name = String(l?.name || '').trim()
    const r = String(l?.room || '').trim()
    if (name && r) m.set(name, r)
  }
  return m
})

const resetAddState = () => {
  selectedTemplate.value = null
  form.value = {
    location: '',
    waterEveryDays: 3,
    notes: '',
    photoUrl: '',
  }
  detailsDialog.value = false
}

const openAdd = () => {
  resetAddState()
  search.value = ''
  activeTag.value = 'all'
  addDialog.value = true
}

const openDetails = (tpl) => {
  selectedTemplate.value = tpl
  form.value = {
    location: '',
    waterEveryDays: 3,
    notes: '',
    photoUrl: '',
  }
  addDialog.value = false
  detailsDialog.value = true
}

const backToCatalog = () => {
  detailsDialog.value = false
  addDialog.value = true
}

const saveNewPlant = async () => {
  if (!selectedTemplate.value) return

  const tpl = selectedTemplate.value
  const petSafeVal = tpl.petSafe ?? tpl.pet_safe ?? tpl.isPetSafe ?? tpl.is_pet_safe ?? null

  await plantsStore.addPlant({
    templateId: tpl.id,
    location: form.value.location,
    waterEveryDays: Number(form.value.waterEveryDays),
    notes: form.value.notes,
    photoUrl: form.value.photoUrl,
    petSafe: petSafeVal,
    tags: tpl.tags ?? [],
    light: tpl.light ?? null,
    species: tpl.species ?? null,
    commonName: tpl.commonName ?? tpl.common_name ?? null,
  })

  detailsDialog.value = false
  selectedTemplate.value = null
  resetAddState()
}

const localIsoDate = (d = new Date()) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const startOfDayIso = (d = new Date()) => localIsoDate(d)

const normalizeDate = (v) => {
  if (!v) return null
  if (v instanceof Date) return v
  if (typeof v === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v
    const d = new Date(v)
    return Number.isNaN(d.getTime()) ? null : d
  }
  if (typeof v === 'number') {
    const d = new Date(v)
    return Number.isNaN(d.getTime()) ? null : d
  }
  if (typeof v === 'object' && typeof v.seconds === 'number') {
    const d = new Date(v.seconds * 1000)
    return Number.isNaN(d.getTime()) ? null : d
  }
  if (typeof v === 'object' && typeof v.toDate === 'function') {
    const d = v.toDate()
    return d instanceof Date && !Number.isNaN(d.getTime()) ? d : null
  }
  return null
}

const toIsoDate = (v) => {
  const d = normalizeDate(v)
  if (!d) return ''
  if (typeof d === 'string') return d
  return localIsoDate(d)
}

const addDaysIso = (isoDate, days) => {
  const d = new Date(isoDate + 'T00:00:00')
  d.setDate(d.getDate() + Number(days || 0))
  return localIsoDate(d)
}

const diffDays = (fromIso, toIso) => {
  const a = new Date(fromIso + 'T00:00:00').getTime()
  const b = new Date(toIso + 'T00:00:00').getTime()
  return Math.round((b - a) / 86400000)
}

const lastIsoOf = (p) =>
  toIsoDate(p?.timestamps?.lastWateredAt) ||
  toIsoDate(p?.lastWateredAt) ||
  toIsoDate(p?.timestamps?.updatedAt) ||
  toIsoDate(p?.timestamps?.createdAt) ||
  toIsoDate(p?.updatedAt) ||
  toIsoDate(p?.createdAt) ||
  ''

const everyDaysOf = (p) => Number(p?.settings?.waterEveryDays || 7)

const computeStatus = (raw) => {
  const today = startOfDayIso()
  const last = lastIsoOf(raw) || today
  const every = everyDaysOf(raw)
  const due = addDaysIso(last, every)
  const d = diffDays(today, due)
  if (d < 0) return 'needs'
  if (d === 0) return 'today'
  if (d === 1) return 'due'
  return 'ok'
}

const normalizedPlants = computed(() =>
  (plantsStore.plants || []).map((p) => {
    const locationName = p?.settings?.location || ''
    const roomName = roomByLocationName.value.get(locationName) || locationName
    return {
      id: p.id,
      name: p?.commonName ?? p?.template?.commonName ?? p?.template?.common_name ?? 'Plant',
      location: locationName,
      room: roomName,
      waterEveryDays: p?.settings?.waterEveryDays ?? 0,
      note: p?.settings?.notes || '',
      photoUrl: p?.photoUrl ?? p?.template?.imageUrl ?? '',
      status: computeStatus(p),
      petSafe:
        p?.petSafe ??
        p?.pet_safe ??
        p?.template?.petSafe ??
        p?.template?.pet_safe ??
        p?.template?.isPetSafe ??
        null,
      tags: p?.tags ?? p?.template?.tags ?? [],
      light: p?.light ?? p?.template?.light ?? null,
      species: p?.species ?? p?.template?.species ?? null,
      _raw: p,
    }
  }),
)

const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()
  return normalizedPlants.value.filter((p) => {
    const matchesQ =
      !term ||
      String(p.name || '')
        .toLowerCase()
        .includes(term) ||
      String(p.room || '')
        .toLowerCase()
        .includes(term)

    const matchesStatus = status.value === 'all' || p.status === status.value
    const matchesRoom = room.value === 'all' || p.room === room.value

    return matchesQ && matchesStatus && matchesRoom
  })
})

const editDialog = ref(false)
const selectedPlant = ref(null)
const editSaving = ref(false)

const editForm = ref({
  location: '',
  waterEveryDays: 3,
  notes: '',
  photoUrl: '',
})

const resetEditState = () => {
  selectedPlant.value = null
  editForm.value = {
    location: '',
    waterEveryDays: 3,
    notes: '',
    photoUrl: '',
  }
  editDialog.value = false
}

const openEdit = (p) => {
  selectedPlant.value = p
  editForm.value = {
    location: p.location || '',
    waterEveryDays: p.waterEveryDays ?? 3,
    notes: p.note || '',
    photoUrl: p.photoUrl || '',
  }
  editDialog.value = true
}

const closeEdit = () => {
  resetEditState()
}

const saveEdit = async () => {
  if (!selectedPlant.value) return
  editSaving.value = true
  try {
    await plantsStore.updatePlant(selectedPlant.value.id, {
      location: editForm.value.location,
      waterEveryDays: Number(editForm.value.waterEveryDays),
      notes: editForm.value.notes,
      photoUrl: editForm.value.photoUrl,
    })
    resetEditState()
  } finally {
    editSaving.value = false
  }
}

const deleteDialog = ref(false)
const plantToDelete = ref(null)
const deleteLoading = ref(false)

const openDelete = (p) => {
  plantToDelete.value = p
  deleteDialog.value = true
}

const confirmDelete = async () => {
  if (!plantToDelete.value) return
  deleteLoading.value = true
  try {
    await plantsStore.deletePlant(plantToDelete.value.id)
    deleteDialog.value = false
    plantToDelete.value = null
  } finally {
    deleteLoading.value = false
  }
}
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
  grid-template-columns: 1fr 220px 220px;
  gap: 12px;
  margin-bottom: 14px;
}

.search,
.sel {
  background: rgba(255, 255, 255, 0.78);
  border-radius: 18px;
}

.grid-my-plants {
  margin-top: 2px;
}

.state {
  padding: 14px 4px;
  font-weight: 800;
  opacity: 0.75;
}

.error {
  opacity: 1;
}

@media (max-width: 960px) {
  .controls {
    grid-template-columns: 1fr;
  }
}
</style>
