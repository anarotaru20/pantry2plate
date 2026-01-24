<template>
  <div class="page">
    <div class="hdr">
      <div>
        <div class="title">Care history</div>
        <div class="sub">Track watering, pruning, fertilizing and repotting</div>
      </div>

      <v-btn rounded="xl" variant="outlined" class="add" @click="openAdd">
        <v-icon start>mdi-plus</v-icon>
        Add log
      </v-btn>
    </div>

    <div class="controls">
      <v-text-field
        v-model="q"
        placeholder="Search by plant or notes..."
        variant="outlined"
        density="comfortable"
        rounded="xl"
        prepend-inner-icon="mdi-magnify"
        hide-details
        class="search"
      />

      <v-select
        v-model="type"
        :items="typeItems"
        item-title="title"
        item-value="value"
        variant="outlined"
        density="comfortable"
        rounded="xl"
        hide-details
        class="sel"
      >
        <template #selection="{ item }">
          <div class="sel-row">
            <v-icon size="18">{{ item.raw.icon }}</v-icon>
            <span>{{ item.raw.title }}</span>
          </div>
        </template>

        <template #item="{ props, item }">
          <v-list-item v-bind="props" :title="null">
            <template #prepend>
              <v-icon size="18">{{ item.raw.icon }}</v-icon>
            </template>
            <template #title>
              <span>{{ item.raw.title }}</span>
            </template>
          </v-list-item>
        </template>
      </v-select>
    </div>

    <div v-if="grouped.length === 0" class="empty">
      <div class="empty-ico">
        <v-icon size="34">mdi-history</v-icon>
      </div>
      <div class="empty-title">No logs yet</div>
      <div class="empty-sub">Add your first care action to start tracking.</div>
      <v-btn rounded="xl" variant="outlined" class="mt-3" @click="openAdd">
        <v-icon start>mdi-plus</v-icon>
        Add log
      </v-btn>
    </div>

    <div v-else class="groups">
      <div v-for="g in grouped" :key="g.date" class="group">
        <div class="group-title">{{ g.label }}</div>

        <v-row dense style="row-gap: 12px">
          <v-col v-for="item in g.items" :key="item.id" cols="12" md="6" lg="4">
            <BaseCard :title="item.plant" :subtitle="labelByType(item.action)">
              <template #chips>
                <v-chip
                  size="small"
                  variant="flat"
                  :class="['action-chip', actionClass(item.action)]"
                >
                  <v-icon start size="16">{{ iconByType(item.action) }}</v-icon>
                  {{ labelChip(item.action) }}
                </v-chip>

                <v-chip size="small" variant="flat" class="date-chip">
                  <v-icon start size="16">mdi-calendar</v-icon>
                  {{ item.date }}
                </v-chip>
              </template>

              <div class="notes">
                {{ (item.notes || '').trim() || 'No description' }}
              </div>

              <template #menu>
                <div class="card-actions-top">
                  <v-btn size="small" variant="text" class="btn-edit" @click="openEdit(item)">
                    <v-icon start size="16">mdi-pencil</v-icon>
                    Edit
                  </v-btn>

                  <v-btn size="small" variant="text" class="btn-delete" @click="removeLog(item.id)">
                    <v-icon start size="16">mdi-delete</v-icon>
                    Delete
                  </v-btn>
                </div>
              </template>
            </BaseCard>
          </v-col>
        </v-row>
      </div>
    </div>

    <BaseDialog
      v-model="dialog"
      :title="dialogTitle"
      :subtitle="
        editingId
          ? 'Update this care entry to keep your plant history accurate.'
          : 'Add care details before saving this log to your history.'
      "
      :max-width="480"
    >
      <div class="d-flex flex-column ga-4">
        <v-select
          v-model="form.plantId"
          :items="plantItems"
          item-title="title"
          item-value="value"
          label="Plant"
          variant="outlined"
          rounded="xl"
          :error="!!errors.plantId"
          :error-messages="errors.plantId"
        />

        <v-select
          v-model="form.action"
          :items="typeItems.filter((x) => x.value !== 'all')"
          item-title="title"
          item-value="value"
          label="Action"
          variant="outlined"
          rounded="xl"
          :error="!!errors.action"
          :error-messages="errors.action"
        />

        <v-text-field
          v-model="form.date"
          label="Date"
          type="date"
          variant="outlined"
          rounded="xl"
          :max="new Date().toISOString().slice(0, 10)"
          :error="!!errors.date"
          :error-messages="errors.date"
        />

        <v-textarea
          v-model="form.notes"
          label="Notes"
          rows="3"
          variant="outlined"
          rounded="xl"
          :error="!!errors.notes"
          :error-messages="errors.notes"
        />
      </div>

      <template #actions>
        <div class="actions-row">
          <v-btn rounded="xl" variant="outlined" @click="dialog = false"> Back </v-btn>

          <v-btn
            rounded="xl"
            variant="flat"
            class="btn-primary"
            @click="save"
            :disabled="!form.plantId || !form.action || !form.date "
          >
            <v-icon start>mdi-check</v-icon>
            {{ editingId ? 'UPDATE' : 'ADD' }}
          </v-btn>
        </div>
      </template>
    </BaseDialog>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import BaseCard from '@/components/BaseCard.vue'
import BaseDialog from '@/components/dialog/BaseDialog.vue'
import { useCareLogsStore } from '@/stores/careLogs'
import { usePlantsStore } from '@/stores/plants'
import {
  isValidCarePlant,
  isValidCareAction,
  isValidCareDate,
  isValidCareNotes,
} from '@/utils/validators'

const careLogsStore = useCareLogsStore()
const plantsStore = usePlantsStore()

const { careLogs } = storeToRefs(careLogsStore)
const { plants } = storeToRefs(plantsStore)

onMounted(async () => {
  await Promise.all([careLogsStore.fetchCareLogs(), plantsStore.fetchPlants()])
})

const q = ref('')
const type = ref('all')
const dialog = ref(false)
const editingId = ref(null)

const dialogTitle = computed(() => (editingId.value ? 'Edit care log' : 'Add care log'))

const form = ref({
  plantId: '',
  action: 'water',
  date: new Date().toISOString().slice(0, 10),
  notes: '',
})

const errors = ref({
  plantId: '',
  action: '',
  date: '',
  notes: '',
})

const typeItems = [
  { title: 'All', value: 'all', icon: 'mdi-filter-variant' },
  { title: 'Water', value: 'water', icon: 'mdi-water' },
  { title: 'Fertilize', value: 'fertilize', icon: 'mdi-leaf' },
  { title: 'Prune', value: 'prune', icon: 'mdi-content-cut' },
  { title: 'Repot', value: 'repot', icon: 'mdi-flower' },
]

const plantItems = computed(() =>
  (plants.value || []).map((p) => ({
    title: p?.template?.commonName || p?.commonName || p?.name || p?.template?.species || 'Plant',
    value: p.id,
  })),
)

const ACTION_CLASS = {
  water: 'water',
  fertilize: 'fertilize',
  prune: 'prune',
  repot: 'repot',
}

const actionClass = (t) => ACTION_CLASS[t] || 'water'

const iconByType = (t) =>
  t === 'water'
    ? 'mdi-water'
    : t === 'fertilize'
      ? 'mdi-leaf'
      : t === 'prune'
        ? 'mdi-content-cut'
        : 'mdi-flower'

const labelByType = (t) =>
  t === 'water'
    ? 'Watered'
    : t === 'fertilize'
      ? 'Fertilized'
      : t === 'prune'
        ? 'Pruned'
        : 'Repotted'

const labelChip = (t) =>
  t === 'water' ? 'Water' : t === 'fertilize' ? 'Fertilize' : t === 'prune' ? 'Prune' : 'Repot'

const uiLogs = computed(() =>
  (careLogs.value || []).map((c) => ({
    id: c.id,
    plantId: c.plantId,
    plant: c.plantName,
    action: c.action,
    date: c.date,
    notes: c.notes,
  })),
)

const plantNameById = (pid) => {
  const p = (plants.value || []).find((x) => x.id === pid)
  return p?.template?.commonName || p?.commonName || p?.name || p?.template?.species || 'Plant'
}

const clearErrors = () => {
  errors.value = { plantId: '', action: '', date: '', notes: '' }
}

const validateForm = () => {
  clearErrors()
  let ok = true

  if (!isValidCarePlant(form.value.plantId)) {
    errors.value.plantId = 'Please select a plant'
    ok = false
  }

  if (!isValidCareAction(form.value.action)) {
    errors.value.action = 'Please select an action'
    ok = false
  }

  if (!isValidCareDate(form.value.date)) {
    errors.value.date = 'Please choose a valid date'
    ok = false
  }

  if (!isValidCareNotes(form.value.notes)) {
    errors.value.notes = 'Notes must be at least 3 characters'
    ok = false
  }

  return ok
}

const openAdd = () => {
  editingId.value = null
  form.value = {
    plantId: '',
    action: 'water',
    date: new Date().toISOString().slice(0, 10),
    notes: '',
  }
  clearErrors()
  dialog.value = true
}

const openEdit = (item) => {
  editingId.value = item.id
  form.value = {
    plantId: item.plantId || '',
    action: item.action || 'water',
    date: item.date || new Date().toISOString().slice(0, 10),
    notes: item.notes || '',
  }
  clearErrors()
  dialog.value = true
}

const save = async () => {
  if (!validateForm()) return

  const pid = form.value.plantId

  const payload = {
    plantId: pid,
    plantName: plantNameById(pid),
    action: form.value.action,
    date: form.value.date,
    notes: (form.value.notes || '').trim(),
  }

  if (editingId.value) await careLogsStore.updateCareLog(editingId.value, payload)
  else await careLogsStore.addCareLog(payload)

  dialog.value = false
}

const removeLog = async (id) => {
  await careLogsStore.deleteCareLog(id)
}

const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()
  return uiLogs.value.filter((x) => {
    if (type.value !== 'all' && x.action !== type.value) return false
    if (!term) return true
    return (
      (x.plant || '').toLowerCase().includes(term) || (x.notes || '').toLowerCase().includes(term)
    )
  })
})

const prettyDay = (iso) => {
  const d = new Date(iso + 'T00:00:00')
  const today = new Date()
  const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  const d0 = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const diff = Math.round((t0 - d0) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
}

const grouped = computed(() => {
  const map = new Map()
  for (const item of filtered.value) {
    const key = item.date
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(item)
  }
  return [...map.entries()]
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([date, items]) => ({ date, label: prettyDay(date), items }))
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

.controls {
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 12px;
  margin-bottom: 14px;
}

.search,
.sel {
  background: rgba(255, 255, 255, 0.78);
  border-radius: 18px;
}

.groups {
  display: grid;
  gap: 18px;
}

.group-title {
  font-weight: 950;
  letter-spacing: -0.2px;
  margin-bottom: 10px;
  opacity: 0.85;
}

.sel-row {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 850;
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

.action-chip {
  font-weight: 800;
  border-radius: 999px;
  padding: 4px 10px;
}

.action-chip.water {
  background: rgba(59, 130, 246, 0.12);
  color: #1e40af;
}

.action-chip.fertilize {
  background: rgba(34, 197, 94, 0.14);
  color: #166534;
}

.action-chip.prune {
  background: rgba(168, 85, 247, 0.14);
  color: #6b21a8;
}

.action-chip.repot {
  background: rgba(249, 115, 22, 0.18);
  color: #9a3412;
}

.date-chip {
  font-weight: 800;
  border-radius: 999px;
  padding: 4px 10px;
  background: rgba(15, 23, 42, 0.08);
  color: rgba(15, 23, 42, 0.8);
}
.notes {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.5;
  font-style: italic;
}
.btn-primary {
  background: #2e7d32;
  color: white;
  font-weight: 900;
  letter-spacing: 0.2px;
  text-transform: none;
  padding: 10px 18px;
  border-radius: 999px !important;
}

.btn-primary:hover {
  filter: brightness(0.98);
}
.actions-row {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

@media (max-width: 960px) {
  .controls {
    grid-template-columns: 1fr;
  }
}
</style>
