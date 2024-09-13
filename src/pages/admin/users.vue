<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
          dense
          :headers="headers"
          :items="activeConnection"
          :items-per-page="-1"
        >
          <template #top>
            <v-subheader>Active connections</v-subheader>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'

import socket from '@/socket'
export default defineComponent({
  data() {
    return {
      activeConnection: [],
      headers: [
        { value: 'socketId', text: 'socketId', width: '150px' },
        { value: 'user._id', text: 'userId', width: '150px' },
        { value: 'user.email', text: 'email' },
        { value: 'user.name', text: 'name' },
      ],
    }
  },
  created() {
    socket.on('activeUsers', (data) => {
      this.activeConnection = data
    })
    socket.emit('getActiveUsers')
  },

  beforeUnmount() {
    socket.off('activeUsers')
  },
})
</script>
<style></style>
