<template>
  <v-row v-if="panelType === 'form'" class="pb-4">
    <v-col cols="auto">
      <v-btn @click="$emit('cancel')"> Отмена </v-btn>
    </v-col>
    <v-col cols="auto">
      <v-btn :disabled="disabledSubmit" color="accent" @click="$emit('submit')">
        {{ submitTitle ? submitTitle : 'Сохранить и закрыть' }}
      </v-btn>
    </v-col>
    <v-col v-if="showSaveBtn" cols="auto">
      <v-btn size="small" icon @click="$emit('save')" :disabled="disabledSubmit">
        <v-icon>mdi-content-save</v-icon>
      </v-btn>
    </v-col>
    <v-col class="slot-wrapper">
      <slot />
    </v-col>
  </v-row>
  <v-row v-else-if="panelType === 'list'" class="pb-4">
    <v-col cols="auto">
      <v-btn :disabled="disabledRefresh" @click="$emit('refresh')"> Обновить </v-btn>
    </v-col>
    <v-col cols="auto">
      <v-btn :disabled="disabledSubmit" color="accent" @click="$emit('submit')"> Создать </v-btn>
    </v-col>
    <v-col class="slot-wrapper">
      <slot />
    </v-col>
  </v-row>
</template>
<script setup>
defineOptions({ name: 'ButtonsPanel' })

defineProps({
  submitTitle: { type: String },
  disabledSubmit: { type: Boolean, default: false },
  disabledRefresh: { type: Boolean, default: false },
  showSaveBtn: { type: Boolean, default: false },
  panelType: {
    type: String,
    required: true,
    validator: function (value) {
      return ['form', 'list'].indexOf(value) !== -1
    },
  },
})

defineEmits(['cancel', 'submit', 'save', 'refresh'])
</script>
<style>
.slot-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 15px;
}
</style>
