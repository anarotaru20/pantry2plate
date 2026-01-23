<template>
  <div class="page">
    <div class="hdr">
      <div>
        <div class="title">Water needs</div>
        <div class="sub">See which plants need water today</div>
      </div>
    </div>

    <div class="summary">
      <div class="sum-item sum-overdue">
        <div class="sum-icon"><v-icon>mdi-alert</v-icon></div>
        <div>
          <div class="sum-val">{{ summary.overdue }}</div>
          <div class="sum-lab">Overdue</div>
        </div>
      </div>

      <div class="sum-item sum-today">
        <div class="sum-icon"><v-icon>mdi-water</v-icon></div>
        <div>
          <div class="sum-val">{{ summary.today }}</div>
          <div class="sum-lab">Today</div>
        </div>
      </div>

      <div class="sum-item">
        <div class="sum-icon"><v-icon>mdi-calendar</v-icon></div>
        <div>
          <div class="sum-val">{{ summary.upcoming }}</div>
          <div class="sum-lab">Upcoming</div>
        </div>
      </div>
    </div>

    <div
      v-if="!groups.overdue.length && !groups.today.length && !groups.upcoming.length"
      class="empty"
    >
      <v-icon size="36">mdi-water-off</v-icon>
      <div class="empty-title">All plants are happy</div>
      <div class="empty-sub">No watering needed right now.</div>
    </div>

    <div v-if="groups.overdue.length" class="group">
      <div class="group-title overdue">Overdue</div>
      <v-row dense>
        <v-col v-for="p in groups.overdue" :key="p.id" cols="12" md="6" lg="4">
          <div class="overdue-wrap">
            <BaseCard :title="p.name" :subtitle="p.location">
              <template #chips>
                <v-chip color="error" size="small" variant="flat">
                  <v-icon start size="16">mdi-alert</v-icon>
                  Overdue
                </v-chip>
                <v-chip size="small" variant="flat">
                  <v-icon start size="16">mdi-calendar</v-icon>
                  {{ Math.abs(dueInDays(p)) }} days late
                </v-chip>
              </template>

              <div class="meta">
                Last watered: <span class="meta-strong">{{ lastLabel(p.last) }}</span>
              </div>

              <template #actions>
                <v-btn rounded="xl" variant="flat" color="error" @click="markDone(p)">
                  Water now
                  <v-icon end>mdi-water</v-icon>
                </v-btn>
              </template>
            </BaseCard>
          </div>
        </v-col>
      </v-row>
    </div>

    <div v-if="groups.today.length" class="group">
      <div class="group-title today">Today</div>
      <v-row dense>
        <v-col v-for="p in groups.today" :key="p.id" cols="12" md="6" lg="4">
          <BaseCard :title="p.name" :subtitle="p.location">
            <template #chips>
              <v-chip size="small" variant="flat">
                <v-icon start size="16">mdi-water</v-icon>
                Today
              </v-chip>
              <v-chip size="small" variant="flat">
                <v-icon start size="16">mdi-clock-outline</v-icon>
                Every {{ p.every }} days
              </v-chip>
            </template>

            <div class="meta">
              Last watered: <span class="meta-strong">{{ lastLabel(p.last) }}</span>
            </div>

            <template #actions>
              <v-btn rounded="xl" variant="outlined" @click="markDone(p)">Mark watered</v-btn>
            </template>
          </BaseCard>
        </v-col>
      </v-row>
    </div>

    <div v-if="groups.upcoming.length" class="group">
      <div class="group-title upcoming">Upcoming</div>
      <v-row dense>
        <v-col v-for="p in groups.upcoming" :key="p.id" cols="12" md="6" lg="4">
          <BaseCard :title="p.name" :subtitle="p.location">
            <template #chips>
              <v-chip size="small" variant="flat">
                <v-icon start size="16">mdi-calendar</v-icon>
                In {{ dueInDays(p) }} days
              </v-chip>
              <v-chip size="small" variant="flat">
                <v-icon start size="16">mdi-clock-outline</v-icon>
                Every {{ p.every }} days
              </v-chip>
            </template>

            <div class="meta">
              Last watered: <span class="meta-strong">{{ lastLabel(p.last) }}</span>
            </div>
          </BaseCard>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import BaseCard from '@/components/BaseCard.vue'
import { usePlantsStore } from '@/stores/plants'
import { useCareLogsStore } from '@/stores/careLogs'

const plantsStore = usePlantsStore()
const careLogsStore = useCareLogsStore()

const { plants } = storeToRefs(plantsStore)

onMounted(async () => {
  await plantsStore.fetchPlants()
})

const startOfDayIso = (d = new Date()) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0, 10)

const normalizeDate = (v) => {
  if (!v) return null
  if (v instanceof Date) return v
  if (typeof v === 'string') {
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
  return d ? startOfDayIso(d) : ''
}

const addDaysIso = (isoDate, days) => {
  const d = new Date(isoDate + 'T00:00:00')
  d.setDate(d.getDate() + Number(days || 0))
  return d.toISOString().slice(0, 10)
}

const diffDays = (fromIso, toIso) => {
  const a = new Date(fromIso + 'T00:00:00').getTime()
  const b = new Date(toIso + 'T00:00:00').getTime()
  return Math.round((b - a) / 86400000)
}

const plantNameOf = (p) =>
  p?.template?.commonName || p?.commonName || p?.name || p?.template?.species || 'Plant'

const locationOf = (p) =>
  p?.settings?.location || p?.location || p?.locationName || p?.room || p?.place || '—'

const lastIsoOf = (p) =>
  toIsoDate(p?.timestamps?.lastWateredAt) ||
  toIsoDate(p?.timestamps?.updatedAt) ||
  toIsoDate(p?.timestamps?.createdAt) ||
  toIsoDate(p?.lastWateredAt) ||
  toIsoDate(p?.updatedAt) ||
  toIsoDate(p?.createdAt) ||
  ''

const everyDaysOf = (p) =>
  Number(p?.settings?.waterEveryDays || p?.template?.care?.waterEveryDays || 7)

const dueInDays = (p) => {
  const today = startOfDayIso()
  const last = p.last
  const due = addDaysIso(last, p.every)
  return diffDays(today, due)
}

const daysSince = (iso) => {
  const today = startOfDayIso()
  const d = diffDays(iso, today)
  return Math.max(0, d)
}

const lastLabel = (iso) => {
  const d = daysSince(iso)
  if (d === 0) return 'today'
  if (d === 1) return 'yesterday'
  return `${d} days ago`
}

const uiPlants = computed(() =>
  (plants.value || []).map((p) => {
    const last = lastIsoOf(p) || startOfDayIso()
    const every = everyDaysOf(p)
    return {
      id: p.id,
      plantId: p.id,
      name: plantNameOf(p),
      location: locationOf(p),
      every,
      last,
    }
  }),
)

const groups = computed(() => {
  const g = { overdue: [], today: [], upcoming: [] }
  uiPlants.value.forEach((p) => {
    const d = dueInDays(p)
    if (d < 0) g.overdue.push(p)
    else if (d === 0) g.today.push(p)
    else g.upcoming.push(p)
  })
  g.upcoming = [...g.upcoming].sort((a, b) => dueInDays(a) - dueInDays(b))
  g.today = [...g.today].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  g.overdue = [...g.overdue].sort((a, b) => dueInDays(a) - dueInDays(b))
  return g
})

const summary = computed(() => ({
  overdue: groups.value.overdue.length,
  today: groups.value.today.length,
  upcoming: groups.value.upcoming.length,
}))

const markDone = async (p) => {
  const today = startOfDayIso()
  await careLogsStore.addCareLog({
    plantId: p.plantId,
    plantName: p.name,
    action: 'water',
    date: today,
    notes: '',
  })
  await plantsStore.fetchPlants()
}
</script>

<style scoped>
.page {
  padding-top: 6px;
}

.hdr {
  margin-bottom: 14px;
}

.title {
  font-size: 1.6rem;
  font-weight: 900;
}

.sub {
  margin-top: 4px;
  opacity: 0.7;
  font-weight: 700;
}

.summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 14px;
}

.sum-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.72);
  border-radius: 18px;
}

.sum-icon {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.06);
}

.sum-val {
  font-weight: 950;
  font-size: 1.15rem;
  line-height: 1;
}

.sum-lab {
  margin-top: 3px;
  opacity: 0.7;
  font-weight: 800;
  font-size: 0.85rem;
}

.sum-overdue {
  border-color: rgba(198, 40, 40, 0.25);
}

.sum-today {
  border-color: rgba(21, 101, 192, 0.22);
}

.group {
  margin-top: 18px;
}

.group-title {
  font-weight: 950;
  margin-bottom: 10px;
}

.group-title.overdue {
  color: #c62828;
}

.group-title.today {
  color: #2e7d32;
}

.group-title.upcoming {
  color: #fb8c00;
}

.empty {
  margin-top: 40px;
  text-align: center;
  opacity: 0.75;
}

.empty-title {
  margin-top: 10px;
  font-weight: 950;
}

.empty-sub {
  margin-top: 6px;
  opacity: 0.75;
  font-weight: 700;
}

.meta {
  margin-top: 10px;
  opacity: 0.78;
  font-weight: 700;
}

.meta-strong {
  font-weight: 950;
  opacity: 0.95;
}

.overdue-wrap {
  border: 1px solid rgba(198, 40, 40, 0.22);
  background: rgba(198, 40, 40, 0.06);
  padding: 10px;
}

@media (max-width: 960px) {
  .summary {
    grid-template-columns: 1fr;
  }
}
</style>
