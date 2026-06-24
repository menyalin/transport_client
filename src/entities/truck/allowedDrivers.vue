<template>
  <div class="mb-6">
    <div class="text-subtitle">
      Водители:
      <div v-if="!driverList || !driverList.length" class="text-caption pl-6 my-2">нет данных</div>
      <v-list v-else>
        <v-list-item v-for="item in driverList" :key="item.driver">
          <template #prepend>
            <v-avatar :style="{ cursor: 'pointer' }" @click="changeDriverState(item)">
              <v-icon v-if="item.isPermanent" color="green"> mdi-account-lock-outline </v-icon>
              <v-icon v-else color="orange"> mdi-account-clock-outline </v-icon>
            </v-avatar>
          </template>
          <v-list-item-title>
            {{
              driversMap.has(item.driver) ? driversMap.get(item.driver).fullName : 'запись удалена'
            }}
          </v-list-item-title>
          <template #append>
            <v-icon size="small" color="error" @click="deleteDriver(item.driver)">
              mdi-delete
            </v-icon>
          </template>
        </v-list-item>
      </v-list>
      <v-autocomplete
        v-if="!isVisibleBtn"
        :items="driversForSelect"
        item-title="fullName"
        item-value="_id"
        @update:model-value="changeDriver"
      />
      <v-btn v-else size="small" variant="text" color="primary" @click="addDriver">
        Добавить водителя
      </v-btn>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

defineOptions({ name: 'AllowedDrivers' })

const driverList = defineModel({ type: Array })

const props = defineProps({
  tkName: {
    type: [String, Object],
    required: true,
  },
})

const store = useStore()

const isVisibleBtn = ref(true)

const driversMap = computed(() => store.getters.driversMap)

const tkNameId = computed(() => {
  if (!!props.tkName && typeof props.tkName === 'string') return props.tkName
  else return props.tkName._id
})

const driversForSelect = computed(() => store.getters.driversForSelect(tkNameId.value))

function addDriver() {
  isVisibleBtn.value = false
}

function changeDriverState(driver) {
  const res = confirm('Вы уверены? ')
  if (!res) return
  driverList.value = driverList.value.map((item) =>
    item.driver === driver.driver ? { ...item, isPermanent: !item.isPermanent } : item
  )
}

function changeDriver(val) {
  if (val && !driverList.value.some((i) => i.driver === val)) {
    driverList.value = [...driverList.value, { driver: val, isPermanent: false }]
  }
  isVisibleBtn.value = true
}

function deleteDriver(id) {
  if (!id) return
  const res = confirm('Вы уверены? ')
  if (!res) return
  driverList.value = driverList.value.filter((item) => item.driver !== id)
}
</script>
<style></style>
