<template>
  <v-menu v-model="showMenu" :target="[menuX, menuY]">
    <v-list>
      <v-list-item :disabled="!hasCreatePermission" @click="handleCreateOrder">
        <v-list-item-title>Создать рейс</v-list-item-title>
      </v-list-item>
      <v-list-item :disabled="!hasDowntimePermission" @click="handleCreateDowntime">
        <v-list-item-title>Создать "сервис/выходной"</v-list-item-title>
      </v-list-item>
      <v-list-item :disabled="!hasScheduleNotePermission" @click="handleCreateScheduleNote">
        <v-list-item-title>Создать заметку</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

defineOptions({ name: 'ScheduleContextMenu' })

const props = defineProps({
  truckId: {
    type: String,
    default: null,
  },
  startDate: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['close'])

const store = useStore()
const router = useRouter()

const showMenu = ref(false)
const menuX = ref(0)
const menuY = ref(0)

const hasCreatePermission = computed(() => store.getters.hasPermission('order:create'))
const hasDowntimePermission = computed(() => store.getters.hasPermission('downtime:write'))
const hasScheduleNotePermission = computed(() => store.getters.hasPermission('scheduleNote:write'))

function open(x, y) {
  menuX.value = x
  menuY.value = y
  showMenu.value = true
}

function close() {
  showMenu.value = false
  emit('close')
}

function handleCreateOrder() {
  router.push({
    name: 'CreateOrder',
    query: { truckId: props.truckId, startDate: props.startDate },
  })
}

function handleCreateDowntime() {
  router.push({
    name: 'DowntimeCreate',
    query: { truckId: props.truckId, startDate: props.startDate },
  })
}

function handleCreateScheduleNote() {
  router.push({
    name: 'ScheduleNoteCreate',
    query: { truckId: props.truckId, startDate: props.startDate },
  })
}

defineExpose({ open, close })
</script>
