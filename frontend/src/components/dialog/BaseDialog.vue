<script setup>
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  maxWidth: { type: [Number, String], default: 920 },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  height: { type: String, default: '78vh' },
})

const emit = defineEmits(['update:modelValue', 'close'])

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}
</script>

<template>
  <v-dialog :model-value="modelValue" :max-width="maxWidth" @update:modelValue="emit('update:modelValue', $event)">
    <v-card rounded="2xl" class="dlg" elevation="0" :style="{ height, maxHeight: height }">
      <div class="dlg-h">
        <div>
          <div class="dlg-t">{{ title }}</div>
          <div v-if="subtitle" class="dlg-s">{{ subtitle }}</div>
        </div>

        <v-btn icon variant="text" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <v-divider class="my-2" />

      <div class="dlg-b">
        <slot />
      </div>

      <template v-if="$slots.footer">
        <v-divider class="my-2" />
        <div class="dlg-f">
          <slot name="footer" />
        </div>
      </template>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.dlg {
  display: flex;
  flex-direction: column;
}

.dlg-h {
  padding: 16px 18px 6px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.dlg-t {
  font-weight: 950;
  font-size: 1.1rem;
}

.dlg-s {
  margin-top: 2px;
  opacity: 0.7;
  font-weight: 650;
  font-size: 0.92rem;
}

.dlg-b {
  flex: 1;
  overflow-y: auto;
  padding: 10px 18px 16px;
  padding-right: 12px;
}

.dlg-f {
  padding: 12px 18px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
