<template>
  <div class="wrapper">
    <div v-if="showTitle" class="text-headline-small">Банковские реквизиты:</div>
    <v-text-field label="Расчетный счет" v-model="state.accountNumber" />
    <v-text-field label="Банк" v-model="state.bankName" />
    <v-text-field label="БИК" v-model="state.bankCode" />
    <v-text-field label="Корр.счет" v-model="state.correspondentAccount" />
  </div>
</template>
<script setup>
import { useVuelidate } from '@vuelidate/core'
import { computed, ref, watch } from 'vue'

defineOptions({ name: 'BankAccountInfoForm' })

const modelValue = defineModel({ type: Object })

defineProps({
  showTitle: {
    type: Boolean,
    default: true,
  },
})

const initialState = () => ({
  accountNumber: '',
  bankName: '',
  bankCode: '',
  correspondentAccount: '',
})
const state = ref(initialState())
const rules = computed(() => {
  return {
    bankName: {},
    accountNumber: {},
    bankCode: {},
    correspondentAccount: {},
  }
})
useVuelidate(rules, state)

watch(
  () => modelValue.value,
  (newVal, oldVal) => {
    if (!newVal) state.value = initialState()
    else if (newVal !== oldVal) state.value = { ...initialState(), ...newVal }
  },
  { deep: true, immediate: true }
)
watch(
  state,
  (val) => {
    modelValue.value = val
  },
  { deep: true }
)
</script>
<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  max-width: 700px;
}
</style>
