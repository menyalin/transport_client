<template>
  <div class="invite-wrapper">
    <h4>Приглашения:</h4>
    <app-invites-table :invites="invites" />
  </div>
</template>
<script setup>
import AppInvitesTable from './invitesTable.vue'

defineOptions({ name: 'CompanyInvites' })

defineProps({
  invites: {
    type: Array,
    required: true,
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
