<template>
  <div class="panel-wrapper">
    <v-btn @click="$router.go(-1)"> Отмена </v-btn>
    <v-btn color="primary" :disabled="disabled" @click="$emit('submit')">
      Заполнить временные метки
    </v-btn>
  </div>
</template>
<script>
export default {
  name: 'TopButtonsPanel',
  props: {
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
  },
  setup() {},
}
</script>
<style scoped>
.panel-wrapper {
  display: flex;
  flex-direction: row;
  gap: 15px;
  margin: 10px;
}
</style>
