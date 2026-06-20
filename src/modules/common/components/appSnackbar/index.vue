<template>
  <div>
    <v-snackbar :model-value="localError" vertical :timeout="timeout">
      <div class="text-body-1">
        {{ error }}
      </div>
      <template #actions="{ attrs }">
        <v-btn color="accent" variant="text" v-bind="attrs" @click="closeFn"> Закрыть </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'

defineOptions({ name: 'AppSnackbar' })

const store = useStore()

const timeout = 3000
const localError = ref(null)
const timeoutInstance = ref(null)

const error = computed(() => store.getters.error)

watch(
  error,
  (val) => {
    if (val) {
      localError.value = val
      timeoutInstance.value = setTimeout(() => {
        store.commit('clearError')
      }, timeout)
    } else {
      localError.value = null
      timeoutInstance.value = null
    }
  },
  { immediate: true }
)

function closeFn() {
  timeoutInstance.value = null
  store.commit('clearError')
}
</script>
<style></style>
