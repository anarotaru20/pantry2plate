<template>
  <div class="page">
    <div class="hdr">
      <div>
        <div class="sub">Your plant overview for today</div>
      </div>

      <div class="hdr-actions">
        <v-btn rounded="xl" variant="outlined" disabled>
          <v-icon start>mdi-plus</v-icon>
          Add plant
        </v-btn>
      </div>
    </div>

    <v-row dense>
      <v-col v-for="s in stats" :key="s.label" cols="12" sm="6" md="3">
        <v-card class="kpi" rounded="2xl" elevation="0">
          <div class="kpi-top">
            <div class="kpi-ic">
              <v-icon>{{ s.icon }}</v-icon>
            </div>
            <div class="kpi-val">{{ s.value }}</div>
          </div>
          <div class="kpi-lab">{{ s.label }}</div>
        </v-card>
      </v-col>
    </v-row>

    <v-row dense class="mt16">
      <v-col cols="12" md="7">
        <v-card class="card" rounded="2xl" elevation="0">
          <div class="card-h">
            <div class="card-t">Watering status</div>
            <v-chip rounded="xl" class="chip" variant="flat">Sorted by urgency</v-chip>
          </div>

          <v-divider class="my-4" />

          <div class="list">
            <div v-if="needsWater.length === 0" class="row">
              <div class="row-left">
                <div class="dot" :style="{ background: statusColor('ok') }"></div>
                <div>
                  <div class="row-title">All good 🎉</div>
                  <div class="row-sub">No plants need watering right now</div>
                </div>
              </div>
            </div>

            <div v-for="p in needsWater" :key="p.id" class="row">
              <div class="row-left">
                <div class="dot" :style="{ background: statusColor(p.status) }"></div>
                <div>
                  <div class="row-title">{{ p.name }}</div>
                  <div class="row-sub">{{ p.location }} • {{ p.hint }}</div>
                </div>
              </div>

              <div class="row-right">
                <v-chip rounded="xl" class="status" variant="flat">
                  {{ statusText(p.status) }}
                </v-chip>
                <v-btn icon variant="text" disabled>
                  <v-icon>mdi-water</v-icon>
                </v-btn>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="5">
        <v-card class="card" rounded="2xl" elevation="0">
          <div class="card-h">
            <div class="card-t">Recent activity</div>
            <v-btn rounded="xl" variant="outlined" disabled>View all</v-btn>
          </div>

          <v-divider class="my-4" />

          <div class="timeline">
            <div v-if="recent.length === 0" class="t-item">
              <div class="t-ic">
                <v-icon size="18">mdi-notebook-outline</v-icon>
              </div>
              <div class="t-body">
                <div class="t-top">
                  <div class="t-title">No activity yet</div>
                  <div class="t-when">—</div>
                </div>
                <div class="t-sub">Add plants and log care to see history here</div>
              </div>
            </div>

            <div v-for="r in recent" :key="r.id" class="t-item">
              <div class="t-ic">
                <v-icon size="18">{{ iconByType(r.type) }}</v-icon>
              </div>

              <div class="t-body">
                <div class="t-top">
                  <div class="t-title">{{ r.plant }}</div>
                  <div class="t-when">{{ r.when }}</div>
                </div>
                <div class="t-sub">{{ r.note }}</div>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { usePlantsStore } from '@/stores/plants'
import { useLocationsStore } from '@/stores/locations'

const plantsStore = usePlantsStore()
const locationsStore = useLocationsStore()

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
  return null
}

const pad2 = (n) => String(n).padStart(2, '0')

const formatWhen = (d) => {
  if (!d) return '—'
  const now = new Date()
  const todayKey = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`
  const dKey = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`

  const hh = pad2(d.getHours())
  const mm = pad2(d.getMinutes())

  if (dKey === todayKey) return `Today • ${hh}:${mm}`

  const y = new Date(now)
  y.setDate(now.getDate() - 1)
  const yKey = `${y.getFullYear()}-${pad2(y.getMonth() + 1)}-${pad2(y.getDate())}`
  if (dKey === yKey) return `Yesterday • ${hh}:${mm}`

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  return `${months[d.getMonth()]} ${d.getDate()} • ${hh}:${mm}`
}

const startOfDay = (d) => {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

const daysDiff = (a, b) => {
  const ms = startOfDay(a).getTime() - startOfDay(b).getTime()
  return Math.round(ms / 86400000)
}

const rawPlants = computed(() => plantsStore.plants || [])

const plants = computed(() =>
  rawPlants.value.map((p) => ({
    id: p.id,
    name: p?.template?.commonName || 'Unnamed plant',
    location: p?.settings?.location || '—',
    waterEveryDays: Number(p?.settings?.waterEveryDays ?? 0),
    lastWateredAt: normalizeDate(p?.timestamps?.lastWateredAt),
    createdAt: normalizeDate(p?.timestamps?.createdAt),
    updatedAt: normalizeDate(p?.timestamps?.updatedAt),
    _raw: p,
  })),
)

const nextWaterDateOf = (p) => {
  if (!p.lastWateredAt) return null
  const interval = Number(p.waterEveryDays)
  if (!Number.isFinite(interval) || interval <= 0) return null
  const d = new Date(p.lastWateredAt)
  d.setDate(d.getDate() + interval)
  return d
}

const wateringStatusOf = (p) => {
  const next = nextWaterDateOf(p)
  if (!next) return { status: 'ok', hint: 'No schedule set', next: null }

  const today = new Date()
  const diff = daysDiff(next, today)

  if (diff < 0) {
    const overdue = Math.abs(diff)
    return { status: 'needs', hint: `Overdue by ${overdue} day${overdue === 1 ? '' : 's'}`, next }
  }
  if (diff === 0) return { status: 'due', hint: 'Due today', next }
  if (diff === 1) return { status: 'due', hint: 'Due tomorrow', next }
  if (diff <= 3) return { status: 'due', hint: `Next in ${diff} days`, next }
  return { status: 'ok', hint: `Next in ${diff} days`, next }
}

const needsWater = computed(() => {
  const rows = plants.value.map((p) => {
    const st = wateringStatusOf(p)
    return {
      id: p.id || `${p.name}-${p.location}`,
      name: p.name,
      location: p.location,
      status: st.status,
      hint: st.hint,
      _sort: st.status === 'needs' ? 0 : st.status === 'due' ? 1 : 2,
      _next: st.next ? st.next.getTime() : Number.POSITIVE_INFINITY,
    }
  })

  rows.sort((a, b) => a._sort - b._sort || a._next - b._next || a.name.localeCompare(b.name))
  return rows.slice(0, 5).map(({ _sort, _next, ...rest }) => rest)
})

const recent = computed(() => {
  const rows = plants.value
    .map((p) => {
      const d = p.updatedAt || p.createdAt
      if (!d) return null
      return {
        id: p.id || `${p.name}-${d.getTime()}`,
        type: 'note',
        plant: p.name,
        when: formatWhen(d),
        note: p.updatedAt ? 'Updated plant details' : 'Added to your collection',
        _t: d.getTime(),
      }
    })
    .filter(Boolean)

  rows.sort((a, b) => b._t - a._t)
  return rows.slice(0, 5).map(({ _t, ...rest }) => rest)
})

const stats = computed(() => {
  const all = plants.value.length
  const needs = plants.value.filter((p) => wateringStatusOf(p).status === 'needs').length
  const dueSoon = plants.value.filter((p) => wateringStatusOf(p).status === 'due').length
  const loc = (locationsStore.locations || []).length

  return [
    { label: 'Plants', value: all, icon: 'mdi-sprout' },
    { label: 'Needs water', value: needs, icon: 'mdi-water-alert' },
    { label: 'Due soon', value: dueSoon, icon: 'mdi-timer-sand' },
    { label: 'Locations', value: loc, icon: 'mdi-map-marker' },
  ]
})

const iconByType = (t) => {
  if (t === 'water') return 'mdi-water'
  if (t === 'fertilize') return 'mdi-sprout'
  if (t === 'prune') return 'mdi-content-cut'
  if (t === 'repot') return 'mdi-flower'
  return 'mdi-notebook-outline'
}

const statusColor = (s) => {
  if (s === 'needs') return 'rgba(239, 68, 68, 0.12)'
  if (s === 'due') return 'rgba(245, 158, 11, 0.12)'
  return 'rgba(34, 197, 94, 0.12)'
}

const statusText = (s) => (s === 'needs' ? 'Needs water' : s === 'due' ? 'Due soon' : 'OK')

onMounted(async () => {
  await Promise.all([plantsStore.fetchPlants?.(), locationsStore.fetchLocations?.()])
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

.mt16 {
  margin-top: 16px;
}

.kpi {
  padding: 16px;
  border: 1px solid rgba(20, 31, 24, 0.08);
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(10px);
}

.kpi-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.kpi-ic {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(46, 125, 50, 0.12);
  border: 1px solid rgba(46, 125, 50, 0.18);
}

.kpi-val {
  font-size: 1.6rem;
  font-weight: 950;
}

.kpi-lab {
  margin-top: 10px;
  font-weight: 850;
  opacity: 0.85;
}

.card {
  padding: 18px 18px 16px;
  border: 1px solid rgba(20, 31, 24, 0.08);
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(10px);
}

.card-h {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.card-t {
  font-weight: 950;
  font-size: 1.05rem;
}

.chip {
  font-weight: 900;
  opacity: 0.9;
}

.list {
  display: grid;
  gap: 10px;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 12px;
  border-radius: 16px;
  border: 1px solid rgba(20, 31, 24, 0.06);
  background: rgba(255, 255, 255, 0.6);
}

.row-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  border: 1px solid rgba(20, 31, 24, 0.08);
}

.row-title {
  font-weight: 950;
}

.row-sub {
  margin-top: 2px;
  font-size: 0.85rem;
  opacity: 0.7;
  font-weight: 650;
}

.row-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status {
  font-weight: 900;
}

.timeline {
  display: grid;
  gap: 12px;
}

.t-item {
  display: flex;
  gap: 10px;
  padding: 10px 10px;
  border-radius: 16px;
  border: 1px solid rgba(20, 31, 24, 0.06);
  background: rgba(255, 255, 255, 0.6);
}

.t-ic {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(18, 23, 38, 0.04);
  border: 1px solid rgba(18, 23, 38, 0.08);
}

.t-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.t-title {
  font-weight: 950;
}

.t-when {
  font-size: 0.8rem;
  opacity: 0.7;
  font-weight: 700;
}

.t-sub {
  margin-top: 2px;
  font-size: 0.85rem;
  opacity: 0.75;
  font-weight: 650;
}
</style>
