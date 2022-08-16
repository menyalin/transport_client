<template>
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">
            Название компании
          </th>
          <th class="text-left">
            ИНН компании
          </th>
          <th class="text-left">
            Должность
          </th>
          <th class="text-left">
            Роли
          </th>
          <th class="text-center">
            Действия
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in invites"
          :key="item._id"
        >
          <td>{{ item.company.name }}</td>
          <td>{{ item.company.inn }}</td>
          <td>{{ item.position }}</td>
          <td>{{ item.roles.map(role => $store.getters.staffRolesMap.get(role)).join(', ') }}</td>
          <td class="text-center">
            <div class="buttons-container">
              <v-icon
                color="green"
                @click="handleAccept(item._id, true)"
              >
                mdi-check
              </v-icon>
              <v-icon
                color="red"
                @click="handleAccept(item._id, false)"
              >
                mdi-cancel
              </v-icon>
            </div>
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>
<script>
import WorkerService from '../../services/worker.service'

export default {
  name: 'InvitesTable',
  props: {
    invites: Array
  },
  methods: {
    async handleAccept(workerId, accepted) {
      try {
        await WorkerService.updateOne(workerId, {accepted, pending: false})
        this.$store.commit('deleteInvite', workerId)

      } catch (e) {

      }
      
    }
  }
}
</script>
<style scoped>
.buttons-container {
  display: flex;
  flex-direction: row;
  gap: 30px;
  justify-content: center;
}
</style>