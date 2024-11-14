<template>
  <div class="wrapper">
    <div class="text-h6">Общая информация о компании:</div>
    <v-select
      label="Тип"
      :items="legalFormItems"
      v-model="state.legalForm"
      dense
      clearable
    />
    <v-text-field label="Полное наименование" v-model="state.fullName" dense />
    <v-text-field label="Почтовый адрес" v-model="state.postalAddress" dense />
    <v-text-field label="Юр. адрес" v-model="state.legalAddress" dense />
    <v-text-field label="ИНН" v-model="state.inn" dense />
    <v-text-field label="ОГРН" v-model="state.ogrn" dense />
    <v-text-field label="ОГРНИП" v-model="state.ogrnip" dense />
    <v-text-field label="КПП" v-model="state.kpp" dense />

    <v-text-field
      v-if="directorPosition"
      :label="directorPosition"
      v-model="state.director.name"
      dense
    />
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
      director: {
        position: null,
        name: null,
      },
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
        director: {
          position: {},
          name: {},
        },
      }
    })
    const v$ = useVuelidate(rules, state)

    /*
  { value: 'legalEntity', text: 'Юр.лицо' },
  { value: 'soleProprietor', text: 'ИП' },
  { value: 'privatePerson', text: 'Частное лицо' },
    */

    const directorPosition = computed(() => {
      if (state.value.legalForm === 'legalEntity') return 'Генеральный директор'
      else if (state.value.legalForm === 'soleProprietor')
        return 'Индивидуальный предприниматель'
      else if (state.value.legalForm === 'privatePerson') return 'Частное лицо'
      else return null
    })

    watch(
      () => props.value,
      (val) => (state.value = val),
      { deep: true }
    )

    watch(state.value, (val) =>
      ctx.emit('change', {
        ...val,
        director: {
          ...val.director,
          position: directorPosition.value,
        },
      })
    )

    return {
      v$,
      state,
      legalFormItems: LEGAL_ENTITY_TYPES,
      directorPosition,
    }
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
