<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table :headers="headers" :items="activeConnection" :items-per-page="-1">
          <template #top>
            <h3>Active connections</h3>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import socket from '@/socket'

defineOptions({ name: 'AdminUsers' })

const activeConnection = ref([])
const headers = [
  { value: 'socketId', text: 'socketId', width: '150px' },
  { value: 'user._id', text: 'userId', width: '150px' },
  { value: 'user.email', text: 'email' },
  { value: 'user.name', text: 'name' },
]

onMounted(() => {
  socket.on('activeUsers', (data) => {
    activeConnection.value = data
  })
  socket.emit('getActiveUsers')
})

onBeforeUnmount(() => {
  socket.off('activeUsers')
})
</script>
<style></style>
