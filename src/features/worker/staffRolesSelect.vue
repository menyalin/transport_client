<template>
  <v-select
    :value="roles"
    :items="allRoles"
    multiple
    label="Роли пользователя"
    outlined
    :disabled="disabled"
    @change="changeHandler"
  />
</template>
<script>
import { computed, getCurrentInstance } from 'vue'
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
  setup(_, ctx) {
    const { proxy } = getCurrentInstance()

    function changeHandler(val) {
      ctx.emit('change', val)
    }
    const allRoles = computed(() => {
      return proxy.$store.getters.staffRoles
    })
    return {
      changeHandler,
      allRoles,
    }
  },
}
</script>
