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
            <span>{{ item.title }}</span>
          </div>
        </template>

        <template #item="{ props, item }">
          <v-list-item v-bind="props">
            <template #prepend>
              <v-icon size="18">{{ item.raw.icon }}</v-icon>
            </template>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
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
                <v-chip size="small" variant="flat">
                  <v-icon start size="16">{{ iconByType(item.action) }}</v-icon>
                  {{ item.action }}
                </v-chip>
                <v-chip size="small" variant="flat">
                  <v-icon start size="16">mdi-calendar</v-icon>
                  {{ item.date }}
                </v-chip>
              </template>

              <div v-if="item.notes">{{ item.notes }}</div>

              <template #menu>
                <v-menu location="bottom end">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" icon variant="text">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>

                  <v-list density="compact">
                    <v-list-item @click="openEdit(item)">
                      <template #prepend>
                        <v-icon size="18">mdi-pencil</v-icon>
                      </template>
                      <v-list-item-title>Edit</v-list-item-title>
                    </v-list-item>

                    <v-list-item @click="removeLog(item.id)">
                      <template #prepend>
                        <v-icon size="18">mdi-delete</v-icon>
                      </template>
                      <v-list-item-title>Delete</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </BaseCard>
          </v-col>
        </v-row>
      </div>
    </div>

    <BaseDialog v-model="dialog" :title="dialogTitle" :max-width="480">
      <v-select
        v-model="form.plantId"
        :items="plantItems"
        item-title="title"
        item-value="value"
        label="Plant"
        variant="outlined"
        rounded="xl"
      />

      <v-select
        v-model="form.action"
        :items="typeItems.filter((x) => x.value !== 'all')"
        item-title="title"
        item-value="value"
        label="Action"
        variant="outlined"
        rounded="xl"
      />

      <v-text-field v-model="form.date" label="Date" type="date" variant="outlined" rounded="xl" />
      <v-textarea v-model="form.notes" label="Notes" rows="3" variant="outlined" rounded="xl" />

      <template #actions>
        <v-btn rounded="xl" variant="text" @click="dialog = false">Cancel</v-btn>
        <v-btn rounded="xl" variant="flat" @click="save">
          Save
          <v-icon end>mdi-check</v-icon>
        </v-btn>
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

const typeItems = [
  { title: 'All', value: 'all', icon: 'mdi-filter-variant' },
  { title: 'Water', value: 'water', icon: 'mdi-water' },
  { title: 'Fertilize', value: 'fertilize', icon: 'mdi-leaf' },
  { title: 'Prune', value: 'prune', icon: 'mdi-content-cut' },
  { title: 'Repot', value: 'repot', icon: 'mdi-flower' },
]

const plantItems = computed(() =>
  (plants.value || []).map((p) => ({
    title:
      p?.template?.commonName ||
      p?.commonName ||
      p?.name ||
      p?.template?.species ||
      'Plant',
    value: p.id,
  })),
)

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
  return (
    p?.template?.commonName || p?.commonName || p?.name || p?.template?.species || 'Plant'
  )
}

const openAdd = () => {
  editingId.value = null
  form.value = {
    plantId: '',
    action: 'water',
    date: new Date().toISOString().slice(0, 10),
    notes: '',
  }
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
  dialog.value = true
}

const save = async () => {
  const pid = form.value.plantId
  if (!pid) return

  const payload = {
    plantId: pid,
    plantName: plantNameById(pid),
    action: form.value.action,
    date: form.value.date,
    notes: (form.value.notes || '').trim(),
  }

  if (editingId.value) {
    await careLogsStore.updateCareLog(editingId.value, payload)
  } else {
    await careLogsStore.addCareLog(payload)
  }

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

@media (max-width: 960px) {
  .controls {
    grid-template-columns: 1fr;
  }
}
</style>
