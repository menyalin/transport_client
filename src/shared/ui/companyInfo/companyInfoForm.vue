<template>
  <div class="wrapper">
    <div class="text-h6">Общая информация о компании:</div>
    <v-select label="Тип" :items="legalFormItems" v />
  </div>
</template>
<script>
import { LEGAL_ENTITY_TYPES } from '@/shared/constants/legalEntityTypes'
import { useVuelidate } from '@vuelidate/core'
import { computed, ref, watch } from 'vue'

export default {
  name: 'CompanyInfoForm',
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
    /*

  director?: Director
  signatory?: Signatory
*/
    const initialState = () => ({
      legalForm: null,
      fullName: null,
      postalAddress: null,
      legalAddress: null,
      inn: null,
      ogrn: null,
      ogrnip: null,
      kpp: null,
    })
    const state = ref(props.value || initialState())
    const rules = computed(() => {
      return {
        legalForm: {},
        fullName: {},
        postalAddress: {},
        legalAddress: {},
        inn: {},
        ogrn: {},
        ogrnip: {},
        kpp: {},
      }
    })
    const v$ = useVuelidate(rules, state)

    watch(
      () => props.value,
      (val) => (state.value = val),
      { deep: true }
    )
    watch(state.value, (val) => ctx.emit('change', val))
    return { v$, state, legalFormItems: LEGAL_ENTITY_TYPES }
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
