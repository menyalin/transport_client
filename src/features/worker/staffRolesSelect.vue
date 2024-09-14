<template>
  <v-select
    :model-value="roles"
    :items="$store.getters.staffRoles"
    multiple
    label="Роли пользователя"
    variant="outlined"
    :disabled="disabled"
    @update:model-value="changeHandler"
  />
</template>
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'StaffRolesSelect',
  model: {
    prop: 'roles',
    event: 'change',
  },
  props: {
    roles: {
      type: Array,
    },
    disabled: {
      type: Boolean,
      default: true,
    },
  },
  setup(_props, ctx) {
    function changeHandler(val) {
      ctx.emit('change', val)
    }
    return {
      changeHandler,
    }
  },
})
</script>
