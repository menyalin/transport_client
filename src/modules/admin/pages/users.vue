<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
          dense
          hide-default-footer
          :headers="headers"
          :items="activeConnection"
          :items-per-page="5"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-subheader>Active connections</v-subheader>
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
    socket.on('activeUsers', (data) => {
      this.activeConnection = data
    })
    socket.emit('getActiveUsers')
  },
  
  beforeDestroy() {
    socket.off('activeUsers')
  },
}
</script>
<style></style>
