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
    <v-text-field
      v-if="state.legalForm === 'legalEntity'"
      label="ОГРН"
      v-model="state.ogrn"
      dense
    />
    <v-text-field
      v-if="state.legalForm === 'soleProprietor'"
      label="ОГРНИП"
      v-model="state.ogrnip"
      dense
    />
    <v-text-field label="КПП" v-model="state.kpp" dense />
    <div class="director-wrapper">
      <v-text-field
        v-if="directorPosition"
        :label="directorPosition"
        v-model="state.director.name"
        hide-details
        dense
      />
      <v-checkbox
        v-model="state.director.isMainSignatory"
        color="primary"
        label="Основной подписант"
        dense
        hide-details
        @change="isMainSignatoryChangedHandler"
      />
    </div>
    <div v-if="showSignatory" class="signatory-wrapper">
      <div class="text-subtitle-2 pb-3">Подписант:</div>
      <v-text-field
        label="Должность"
        v-model="state.signatory.position"
        dense
      />
      <v-text-field label="ФИО" v-model="state.signatory.fullName" dense />
      <v-text-field
        label="Номер доверенности"
        v-model="state.signatory.number"
        dense
      />
      <DateTimeInput
        type="date"
        label="Дата доверенности"
        v-model="state.signatory.date"
        dense
      />
    </div>
  </div>
</template>
<script>
import { LEGAL_ENTITY_TYPES } from '@/shared/constants/legalEntityTypes'
import { useVuelidate } from '@vuelidate/core'
import { computed, ref, watch } from 'vue'
import { DateTimeInput } from '@/shared/ui'

export default {
  name: 'CompanyInfoForm',
  components: { DateTimeInput },
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
    const defaultSignatoryState = () => ({
      position: null,
      fullName: null,
      number: null,
      date: null,
    })
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
        isMainSignatory: true,
        position: null,
        name: null,
      },
      signatory: defaultSignatoryState(),
    })
    const state = ref(
      {
        signatory: defaultSignatoryState(),
        ...props.value,
      } || initialState()
    )
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
          isMainSignatory: {},
          position: {},
          name: {},
        },
        signatory: {
          position: {},
          fullName: {},
          number: {},
          date: {},
        },
      }
    })
    const v$ = useVuelidate(rules, state)

    const directorPosition = computed(() => {
      if (state.value.legalForm === 'legalEntity') return 'Генеральный директор'
      else if (state.value.legalForm === 'soleProprietor')
        return 'Индивидуальный предприниматель'
      else if (state.value.legalForm === 'privatePerson') return 'Частное лицо'
      else return null
    })

    const showSignatory = computed(() => {
      if (
        !!state.value.legalForm &&
        state.value.director.isMainSignatory === false
      )
        return true
      else return false
    })

    function isMainSignatoryChangedHandler(val) {
      if (!val && !state.value.signatory?.position)
        state.value = { ...state.value, signatory: defaultSignatoryState() }
    }

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
      showSignatory,
      isMainSignatoryChangedHandler,
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
.signatory-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 30px;
  max-width: 700px;
}
</style>
