<template>
  <div>
    <div class="text-caption text--secondary mb-2">Роли пользователя</div>
    <v-checkbox
      v-for="role in allRoles"
      :key="role.value"
      :label="role.text"
      :input-value="roles?.includes(role.value)"
      :disabled="disabled"
      hide-details
      class="mt-0 pt-0"
      @change="toggleRole(role.value)"
    />
  </div>
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
  setup(props, ctx) {
    const { proxy } = getCurrentInstance()

    function toggleRole(roleValue) {
      const currentUserRoles = props.roles || []
      let newVal = []
      if (currentUserRoles.includes(roleValue))
        newVal = currentUserRoles.filter((r) => r !== roleValue)
      else newVal = [...currentUserRoles, roleValue]

      ctx.emit('change', newVal)
    }

    const allRoles = computed(() => {
      return proxy.$store.getters.staffRoles
    })

    return {
      toggleRole,
      allRoles,
    }
  },
}
</script>
