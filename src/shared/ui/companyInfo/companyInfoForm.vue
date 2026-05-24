<template>
  <div class="wrapper">
    <div v-if="showTitle" class="text-h6">Общая информация о компании:</div>
    <v-select label="Тип" :items="legalFormItems" v-model="state.legalForm" clearable />
    <v-text-field label="Полное наименование" v-model="state.fullName" />
    <v-textarea label="Почтовый адрес" v-model="state.postalAddress" rows="4" />
    <v-textarea label="Юр. адрес" v-model="state.legalAddress" rows="4" />
    <v-text-field label="ИНН" v-model="state.inn" />
    <v-text-field
      v-if="state.legalForm && state.legalForm === 'legalEntity'"
      label="ОГРН"
      v-model="state.ogrn"
    />
    <v-text-field
      v-if="state.legalForm && state.legalForm === 'soleProprietor'"
      label="ОГРНИП"
      v-model="state.ogrnip"
    />
    <v-text-field label="КПП" v-model="state.kpp" />
    <v-text-field label="ОКПО" v-model="state.okpo" />
    <v-text-field label="Бухгалтер" v-model="accountantName" />

    <div v-if="directorPosition && !!state.director" class="director-wrapper">
      <v-text-field :label="directorPosition" v-model="directorName" hide-details />
      <v-checkbox
        label="Основной подписант"
        v-model="state.director.isMainSignatory"
        color="primary"
        hide-details
        @update:model-value="isMainSignatoryChangedHandler"
      />
    </div>
    <SignatoryForm v-if="showSignatory" class="signatory-wrapper" v-model="state.signatory" />
  </div>
</template>
<script>
import { LEGAL_ENTITY_TYPES } from '@/shared/constants/legalEntityTypes'
import { useVuelidate } from '@vuelidate/core'
import { computed, ref, watch } from 'vue'
import { DateTimeInput } from '@/shared/ui'
import SignatoryForm from './signatoryForm.vue'

export default {
  name: 'CompanyInfoForm',
  components: { DateTimeInput, SignatoryForm },
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
    const accountantName = computed({
      get: () => props.value?.accountant?.name || '',
      set: (val) => {
        state.value = {
          ...state.value,
          accountant: { ...state.value.accountant, name: val },
        }
      },
    })

    const directorName = computed({
      get: () => props.value.director?.name || '',
      set: (val) => {
        state.value.director = { ...state.value.director, name: val }
      },
    })
    const defaultSignatoryState = () => ({
      position: '',
      fullName: '',
      number: '',
      date: '',
    })
    const directorDefaultState = () => ({
      isMainSignatory: true,
      position: '',
      name: '',
    })
    const accountantDefaultState = () => ({
      isMainSignatory: false,
      position: 'Бухгалтер',
      name: '',
    })

    const initialState = () => ({
      legalForm: null,
      fullName: null,
      postalAddress: null,
      legalAddress: null,
      inn: null,
      ogrn: null,
      ogrnip: null,
      okpo: null,
      kpp: null,
      director: directorDefaultState(),
      signatory: defaultSignatoryState(),
      accountant: accountantDefaultState(),
    })
    const state = ref(initialState())

    const rules = computed(() => {
      return {
        legalForm: {},
        fullName: {},
        postalAddress: {},
        legalAddress: {},
        inn: {},
        ogrn: {},
        okpo: {},
        ogrnip: {},
        kpp: {},
        director: {
          isMainSignatory: {},
          position: {},
          name: {},
        },
        accountant: {
          name: {},
          position: {},
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
      if (state.value?.legalForm === 'legalEntity') return 'Генеральный директор'
      else if (state.value?.legalForm === 'soleProprietor') return 'Индивидуальный предприниматель'
      else if (state.value?.legalForm === 'privatePerson') return 'Частное лицо'
      else return null
    })

    const showSignatory = computed(() => {
      if (!!state.value?.legalForm && state.value.director?.isMainSignatory === false) return true
      else return false
    })

    function isMainSignatoryChangedHandler(val) {
      if (!val && !state.value.signatory?.position)
        state.value = { ...state.value, signatory: defaultSignatoryState() }
    }

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

    return {
      v$,
      accountantName,
      directorName,
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
</style>
