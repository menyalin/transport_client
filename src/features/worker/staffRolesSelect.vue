<template>
  <v-select
    :value="roles"
    :items="$store.getters.staffRoles"
    multiple
    label="Роли пользователя"
    outlined
    :disabled="disabled"
    @change="changeHandler"
  />
</template>
<script>
export default {
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
}
</script>
