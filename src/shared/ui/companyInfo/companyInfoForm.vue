<template>
  <div class="wrapper">
    <div v-if="showTitle" class="text-h6">Общая информация о компании:</div>
    <v-select v-model="state.legalForm" label="Тип" :items="legalFormItems" clearable />
    <v-text-field v-model="state.fullName" label="Полное наименование" />
    <v-textarea v-model="state.postalAddress" label="Почтовый адрес" variant="outlined" rows="4" />
    density="compact"
    <v-textarea v-model="state.legalAddress" label="Юр. адрес" variant="outlined" rows="4" />
    density="compact"
    <v-text-field v-model="state.inn" label="ИНН" />
    <v-text-field v-if="state.legalForm && state.legalForm === 'legalEntity'" v-model="state.ogrn" label="ОГРН" />
    <v-text-field
      v-if="state.legalForm && state.legalForm === 'soleProprietor'"
      v-model="state.ogrnip"
      label="ОГРНИП"
    />
    <v-text-field v-model="state.kpp" label="КПП" />
    <v-text-field v-model="accountantName" label="Бухгалтер" />

    <div v-if="directorPosition && !!state.director" class="director-wrapper">
      <v-text-field v-model="directorName" :label="directorPosition" hideDetails />
      <v-checkbox
        v-model="state.director.isMainSignatory"
        color="primary"
        label="Основной подписант"
        hideDetails
        @update:model-value="isMainSignatoryChangedHandler"
      />
    </div>
    <SignatoryForm v-if="showSignatory" v-model="state.signatory" class="signatory-wrapper" />
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
        set: val => {
          state.value = {
            ...state.value,
            accountant: { ...state.value.accountant, name: val },
          }
        },
      })

      const directorName = computed({
        get: () => props.value.director?.name || '',
        set: val => {
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
        val => {
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
