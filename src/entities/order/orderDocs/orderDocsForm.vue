<template>
  <v-card>
    <v-card-title>
      <h5>Документы</h5>
    </v-card-title>

    <v-card-text>
      <v-table density="compact">
        <template #default>
          <thead>
            <tr>
              <th class="text-center" width="50px">Опись</th>
              <th class="text-left">Тип*</th>
              <th class="text-left">Номер</th>
              <th class="text-left">Комментарий</th>
              <th class="text-left">Статус*</th>
              <th class="text-left" width="220px">Дата получения</th>
              <th width="50px" />
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) of value" :key="idx">
              <td class="text-center">
                <v-checkbox v-model="item.addToRegistry" hide-details />
              </td>
              <td>
                <v-select
                  v-model="item.type"
                  hide-details
                  :disabled="readonly"
                  :items="docTypes"
                  itemTitle="text"
                  class="my-2"
                />
              </td>
              <td>
                <v-text-field
                  v-model.trim="item.number"
                  hide-details
                  :disabled="readonly"
                  :style="{ minWidth: '150px' }"
                />
              </td>
              <td>
                <v-text-field v-model.trim="item.note" hide-details :disabled="readonly" />
              </td>
              <td>
                <v-select
                  v-model="item.status"
                  hide-details
                  :items="docStatuses"
                  itemTitle="text"
                  :disabled="readonly"
                  :class="{ 'not-accepted': item.status !== 'accepted' }"
                />
              </td>
              <td>
                <DateTimeInput v-model="item.date" hide-details :disabled="readonly" />
              </td>
              <td>
                <v-icon size="small" :disabled="readonly" @click="deleteRow(idx)">
                  mdi-delete
                </v-icon>
              </td>
            </tr>
          </tbody>
        </template>
      </v-table>
      <app-group-dialog :dialog="groupDialog" @pushDocs="addGroup" @close="closeGroupDocDialog" />
    </v-card-text>
    <v-card-actions>
      <div class="btn-wrapper">
        <v-btn :disabled="readonly || !isValid" @click="openGroupDocDialog">
          Добавить документы
        </v-btn>
        <slot />
      </div>
    </v-card-actions>
  </v-card>
</template>
<script setup>
import { ref, computed } from 'vue'
import { DateTimeInput } from '@/shared/ui'
import appGroupDialog from './groupDialog.vue'
import { useStore } from 'vuex'

const vuexStore = useStore()

defineOptions({ name: 'DocListForm' })
const value = defineModel({ type: Array })
const groupDialog = ref(false)
defineProps({
  isValid: {
    type: Boolean,
    required: true,
  },
  readonly: {
    type: Boolean,
    required: true,
  },
})
const docTypes = computed(() => vuexStore.getters.documentTypes)
const docStatuses = computed(() => vuexStore.getters.documentStatuses)

function openGroupDocDialog() {
  groupDialog.value = true
}
function closeGroupDocDialog() {
  groupDialog.value = false
}

function addGroup(val) {
  value.value.push(...val)
}
function deleteRow(idx) {
  value.value.splice(idx, 1)
}
</script>
<style scoped>
.docs-wrapper {
  margin: 5px;
  padding: 15px;
}
.invalid {
  border: tomato 2px solid;
  border-radius: 15px;
}
.btn-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 15px;
  align-items: center;
  margin-bottom: 15px;
}
.not-accepted {
  background-color: rgba(255, 0, 0, 0.1);
}
</style>
