<script setup>
const props = defineProps({
  plant: {
    type: Object,
    required: true,
  },
})

const lightIcon = (v) =>
  v === 'low' ? 'mdi-weather-night' : v === 'medium' ? 'mdi-weather-partly-cloudy' : 'mdi-weather-sunny'

const waterIcon = (v) =>
  v === 'low' ? 'mdi-water-outline' : v === 'medium' ? 'mdi-water' : 'mdi-water-plus'

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '')
</script>

<template>
  <v-card class="card" rounded="2xl" elevation="0">
    <div class="top">
      <div class="pic">
        <v-icon size="22">mdi-sprout</v-icon>
      </div>

      <div class="top-chips">
        <v-chip v-if="plant.light" class="mini" rounded="xl" variant="flat">
          <v-icon start size="16">{{ lightIcon(plant.light) }}</v-icon>
          {{ plant.light }}
        </v-chip>

        <v-chip v-if="plant.water" class="mini" rounded="xl" variant="flat">
          <v-icon start size="16">{{ waterIcon(plant.water) }}</v-icon>
          {{ plant.water }}
        </v-chip>
      </div>
    </div>

    <div class="body">
      <div class="name">{{ plant.commonName || plant.name }}</div>
      <div class="sub">{{ plant.scientificName || plant.species }}</div>

      <div class="tags">
        <v-chip v-if="plant.petSafe" class="tag" rounded="xl" variant="flat">
          pet-safe
        </v-chip>

        <v-chip v-for="t in (plant.tags || []).slice(0, 3)" :key="t" class="tag" rounded="xl" variant="flat">
          {{ cap(t) }}
        </v-chip>
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.card {
  border: 1px solid rgba(20, 31, 24, 0.08);
  background: rgba(255, 255, 255, 0.9);
  overflow: hidden;
  cursor: pointer;
  transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
}

.card:hover {
  transform: translateY(-1px);
  border-color: rgba(46, 125, 50, 0.22);
  box-shadow: 0 18px 55px rgba(18, 23, 38, 0.08);
}

.top {
  padding: 14px 14px 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.pic {
  width: 44px;
  height: 44px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: rgba(46, 125, 50, 0.12);
  border: 1px solid rgba(46, 125, 50, 0.18);
}

.top-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: flex-end;
}

.mini {
  font-weight: 900;
  font-size: 0.78rem;
  border: 1px solid rgba(20, 31, 24, 0.08);
  background: rgba(255, 255, 255, 0.7);
  opacity: 0.85;
}

.body {
  padding: 12px 14px 14px;
}

.name {
  font-weight: 950;
  font-size: 1.05rem;
  letter-spacing: -0.2px;
}

.sub {
  margin-top: 2px;
  font-size: 0.88rem;
  opacity: 0.7;
  font-weight: 650;
}

.tags {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  font-weight: 900;
  font-size: 0.8rem;
  background: rgba(18, 23, 38, 0.04);
  border: 1px solid rgba(18, 23, 38, 0.08);
  opacity: 0.8;
}
</style>
