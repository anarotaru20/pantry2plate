<template>
  <BaseDialog
    :model-value="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    title="New plant"
    subtitle="Set details before adding it to your collection"
    max-width="720"
  >
    <div class="preview">
      <div class="preview-ic">
        <v-icon size="22">mdi-sprout</v-icon>
      </div>

      <div class="preview-txt">
        <div class="p-name">{{ plant?.commonName || plant?.name }}</div>
        <div class="p-sub">{{ plant?.scientificName || plant?.species }}</div>
      </div>

      <div class="preview-tags">
        <v-chip v-if="plant?.petSafe" class="tag" rounded="xl" variant="flat">
          <v-icon start size="16">mdi-paw</v-icon>
          Pet-safe
        </v-chip>
        <v-chip
          v-for="t in (plant?.tags || []).slice(0, 2)"
          :key="t"
          class="tag"
          rounded="xl"
          variant="flat"
        >
          {{ t }}
        </v-chip>
      </div>
    </div>

    <v-row dense class="mt12">
      <v-col cols="12" sm="5.5">
        <v-select
          :model-value="form.location"
          @update:modelValue="setField('location', $event)"
          :items="locations"
          label="Location"
          variant="outlined"
          density="comfortable"
          rounded="xl"
          hide-details
        />
      </v-col>

      <v-col cols="12" sm="5.5">
        <v-text-field
          :model-value="form.waterEveryDays"
          @update:modelValue="setField('waterEveryDays', Number($event))"
          type="number"
          min="1"
          label="Water every (days)"
          variant="outlined"
          density="comfortable"
          rounded="xl"
          hide-details
        />
      </v-col>

      <!-- add photoUrl -->
      <v-col cols="12">
        <v-text-field
          :model-value="form.photoUrl"
          @update:modelValue="(v) => setForm({ photoUrl: v })"
          label="Photo URL"
          placeholder="https://..."
          variant="outlined"
          density="comfortable"
          rounded="xl"
          hide-details
        />
      </v-col>
      <div v-if="form.photoUrl" class="img-prev">
        <img :src="form.photoUrl" alt="plant" />
      </div>

      <v-col cols="12">
        <v-textarea
          :model-value="form.notes"
          @update:modelValue="setField('notes', $event)"
          label="Notes"
          placeholder="Anything to remember?"
          variant="outlined"
          density="comfortable"
          rounded="xl"
          rows="3"
          auto-grow
          hide-details
        />
      </v-col>
    </v-row>

    <div class="hint">
      Tip: later we’ll save this in Firestore and compute watering status automatically.
    </div>

    <template #footer>
      <v-btn rounded="xl" variant="outlined" @click="emit('back')"> Back </v-btn>

      <v-spacer />

      <v-btn rounded="xl" variant="flat" class="save" @click="emit('save')">
        <v-icon start>mdi-check</v-icon>
        Add to my plants
      </v-btn>
    </template>
  </BaseDialog>
</template>

<script setup>
import { computed } from 'vue'
import BaseDialog from './BaseDialog.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  mode: { type: String, default: 'add' },
  plant: { type: Object, default: null },
  form: { type: Object, required: true },
  locations: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:modelValue', 'update:form', 'back', 'save'])

const setField = (key, value) => {
  emit('update:form', { ...props.form, [key]: value })
}
</script>

<style scoped>
.mt12 {
  margin-top: 12px;
  gap: 15px;
}

.preview {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 18px;
  border: 1px solid rgba(20, 31, 24, 0.08);
  background: rgba(255, 255, 255, 0.7);
}

.preview-ic {
  width: 46px;
  height: 46px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: rgba(46, 125, 50, 0.12);
  border: 1px solid rgba(46, 125, 50, 0.18);
}

.preview-txt {
  min-width: 0;
}

.p-name {
  font-weight: 950;
  letter-spacing: -0.2px;
}

.p-sub {
  margin-top: 2px;
  font-size: 0.85rem;
  opacity: 0.7;
  font-weight: 650;
}

.preview-tags {
  margin-left: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: flex-end;
}

.hint {
  margin-top: 10px;
  font-size: 0.86rem;
  opacity: 0.7;
  font-weight: 650;
}

.save {
  font-weight: 900;
  background: rgba(46, 125, 50, 0.14);
  border: 1px solid rgba(46, 125, 50, 0.22);
}
.img-prev {
  margin-top: 10px;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(20, 31, 24, 0.08);
  background: rgba(255, 255, 255, 0.7);
}

.img-prev img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
}
</style>
