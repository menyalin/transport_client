<template>
  <div class="wrapper">
    <div v-if="showTitle" class="text-h6">Банковские реквизиты:</div>
    <v-text-field label="Расчетный счет" v-model="state.accountNumber" dense />
    <v-text-field label="Банк" v-model="state.bankName" dense />
    <v-text-field label="БИК" v-model="state.bankCode" dense />
    <v-text-field
      label="Корр.счет"
      v-model="state.correspondentAccount"
      dense
    />
  </div>
</template>
<script>
import { useVuelidate } from '@vuelidate/core'
import { computed, ref, watch } from 'vue'

export default {
  name: 'BankAccountInfoForm',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: Object,
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, ctx) {
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
    const v$ = useVuelidate(rules, state)

    watch(
      () => props.value,
      (newVal, oldVal) => {
        if (!newVal) state.value = initialState()
        else if (newVal !== oldVal) state.value = newVal
      },
      { deep: true, immediate: true }
    )
    watch(
      state,
      (val) => {
        ctx.emit('change', val)
      },
      { deep: true }
    )

    return { v$, state }
  },
}
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
