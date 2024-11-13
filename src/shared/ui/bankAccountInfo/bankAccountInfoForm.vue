<template>
  <div class="wrapper">
    <div class="title">Банковские реквизиты:</div>
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
import { watch } from 'vue'
import { computed, ref } from 'vue'

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
  },
  setup(props, ctx) {
    const initialState = () => ({
      accountNumber: '',
      bankName: '',
      bankCode: '',
      correspondentAccount: '',
    })
    const state = ref(props.value || initialState())
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
      (val) => (state.value = val),
      { deep: true }
    )
    watch(state.value, (val) => ctx.emit('change', val))
    return { v$, state }
  },
}
/*
 accountNumber: z.string().optional(),
 bankName: z.string().optional(),
 bankCode: z.string().optional(),
 correspondentAccount: z.string().optional(),

*/
</script>
<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  max-width: 700px;
}
.title {
  font-weight: bold;
  font-size: medium;
}
</style>
