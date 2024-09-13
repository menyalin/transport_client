<template>
  <div class="invite-wrapper">
    <h4>Приглашения:</h4>
    <app-invites-table :invites="invites" />
  </div>
</template>
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'

import AppInvitesTable from './invitesTable.vue'

export default defineComponent({
  name: 'CompanyInvites',
  components: {
    AppInvitesTable,
  },
  props: {
    invites: {
      type: Array,
      required: true,
    },
  },
})
</script>
<style scoped>
.invite-wrapper {
  border: 1px dotted grey;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
}
</style>
