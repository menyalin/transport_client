<template>
  <div class="panel-wrapper">
    <v-btn @click="router.go(-1)"> Отмена </v-btn>
    <v-btn @click="$emit('submit')" color="primary" :disabled="disabled">
      Заполнить временные метки
    </v-btn>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'

defineOptions({ name: 'TopButtonsPanel' })

defineProps({
  disabled: { type: Boolean, default: false },
})

defineEmits(['submit'])

const router = useRouter()
</script>
<style scoped>
.panel-wrapper {
  display: flex;
  flex-direction: row;
  gap: 15px;
  margin: 10px;
}
</style>
