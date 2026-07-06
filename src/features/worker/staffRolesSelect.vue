<template>
  <div>
    <div class="text-caption text-secondary mb-2">Роли пользователя</div>
    <v-checkbox
      v-for="role in allRoles"
      :key="role.value"
      :label="role.text"
      :model-value="roles?.includes(role.value)"
      :disabled="disabled"
      hide-details
      class="mt-0 pt-0"
      @update:model-value="toggleRole(role.value)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

defineProps({
  disabled: {
    type: Boolean,
    default: true,
  },
})

const roles = defineModel({ type: Array })

const store = useStore()

const allRoles = computed(() => store.getters.staffRoles)

function toggleRole(roleValue) {
  const current = roles.value || []
  if (current.includes(roleValue)) {
    roles.value = current.filter((r) => r !== roleValue)
  } else {
    roles.value = [...current, roleValue]
  }
}
</script>
