<template>
  <div>
    <v-snackbar v-model="showSnackbar" vertical :timeout="timeout">
      <div class="text-body-large">
        {{ errorMessage }}
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
const showSnackbar = ref(false)
const errorMessage = ref('')
const timeoutInstance = ref(null)

const error = computed(() => store.getters.error)

watch(
  error,
  (val) => {
    if (val) {
      errorMessage.value = val
      showSnackbar.value = true
      timeoutInstance.value = setTimeout(() => {
        store.commit('clearError')
      }, timeout)
    } else {
      showSnackbar.value = false
      errorMessage.value = ''
      timeoutInstance.value = null
    }
  },
  { immediate: true }
)

function closeFn() {
  clearTimeout(timeoutInstance.value)
  timeoutInstance.value = null
  store.commit('clearError')
}
</script>
<style></style>
