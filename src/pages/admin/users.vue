<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table :headers="headers" :items="activeConnection"
:items-per-page="-1">
          <template #top>
            <v-toolbar flat>
              <v-toolbar-title>Active connections</v-toolbar-title>
            </v-toolbar>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import socket from '@/socket'
export default {
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
    socket.on('activeUsers', data => {
      this.activeConnection = data
    })
    socket.emit('getActiveUsers')
  },

  beforeUnmount() {
    socket.off('activeUsers')
  },
}
</script>
<style></style>
