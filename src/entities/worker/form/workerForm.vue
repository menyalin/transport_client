<template>
  <div>
    <ButtonsPanel
      panelType="form"
      :disabledSubmit="!$store.getters.hasPermission('worker:write') || v$.form.$invalid || !formChanged"
      class="mb-4"
      @cancel="cancel"
      @submit="submit"
    />

    <div class="input-row">
      <v-text-field
        v-model.trim="form.name"
        :errorMessages="getNameErrors()"
        variant="outlined"
        density="compact"
        label="Сокращенное имя"
        :style="{ 'max-width': '330px' }"
        @blur="v$.form.name.$touch()"
        @update:model-value="v$.form.name.$touch()"
      />
      <v-text-field
        v-model.trim="form.fullName"
        :errorMessages="getFullNameErrors()"
        variant="outlined"
        density="compact"
        label="Полное имя"
        @blur="v$.form.fullName.$touch()"
        @update:model-value="v$.form.fullName.$touch()"
      />
    </div>
    <div class="input-row">
      <v-text-field
        v-model="form.employmentDate"
        type="date"
        variant="outlined"
        density="compact"
        label="Дата приема на работу"
        :style="{ 'max-width': '260px' }"
      />

      <v-text-field
        v-model="form.dismissalDate"
        type="date"
        variant="outlined"
        density="compact"
        label="Дата увольнения"
        :style="{ 'max-width': '260px' }"
      />
    </div>

    <v-text-field v-model.trim="form.position" variant="outlined" label="Должность" density="compact" />

    <v-text-field v-model.trim="form.note" variant="outlined" label="Примечание" density="compact" />

    <div v-if="!item._id" class="text-caption mx-3">
      *Для сопоставления сотрудника с пользователем, запись необходимо сохранить
    </div>
    <v-btn v-if="displayDeleteBtn" color="error" @click="$emit('delete')">
      <v-icon start>mdi-delete</v-icon>
      Удалить
    </v-btn>
  </div>
</template>
<script>
  import { ref, reactive, computed, watch, onMounted } from 'vue'
  import { useStore } from 'vuex'
  import useVuelidate from '@vuelidate/core'
  import { required } from '@vuelidate/validators'
  import dayjs from 'dayjs'
  import { ButtonsPanel } from '@/shared/ui'

  export default {
    name: 'WorkerForm',
    components: {
      ButtonsPanel,
    },
    props: {
      item: {
        type: Object,
      },
      displayDeleteBtn: {
        type: Boolean,
        default: false,
      },
      openInModal: {
        type: Boolean,
        default: false,
      },
    },

    setup(props, { emit }) {
      const store = useStore()
      const dateFields = ['dismissalDate', 'employmentDate']

      // Form state
      const form = reactive({
        name: null,
        fullName: null,
        position: null,
        note: null,
        employmentDate: null, // дата приема на работу
        dismissalDate: null, // дата увольнения
      })

      // Initial state for change detection
      const initialFormState = ref(null)

      // Vuelidate rules
      const rules = {
        form: {
          name: { required },
          fullName: { required },
          position: {},
        },
      }

      const v$ = useVuelidate(rules, { form })

      // Computed properties
      const directoriesProfile = computed(() => store.getters.directoriesProfile)

      const formState = computed(() => {
        const dates = {}
        dateFields.forEach(item => {
          dates[item] = form[item] ? dayjs(form[item]).toISOString() : null
        })
        return { ...form, company: directoriesProfile.value, ...dates }
      })

      const formChanged = computed(() => {
        return JSON.stringify(formState.value) !== initialFormState.value
      })

      // Methods
      const getNameErrors = () => {
        const errors = []
        if (v$.value.form.name.$dirty && v$.value.form.name.$invalid) errors.push('Имя не может быть пустым')
        return errors
      }

      const getFullNameErrors = () => {
        const errors = []
        if (v$.value.form.fullName.$dirty && v$.value.form.fullName.$invalid)
          errors.push('Полное имя не может быть пустым')
        return errors
      }

      const setFormFields = val => {
        const keys = Object.keys(form)
        keys.forEach(key => {
          if (dateFields.includes(key) && !!val[key]) {
            form[key] = dayjs(val[key]).format('YYYY-MM-DD')
          } else form[key] = val[key]
        })
      }

      const resetForm = () => {
        const keys = Object.keys(form)
        keys.forEach(key => {
          form[key] = null
        })
        v$.value.$reset()
      }

      const submit = () => {
        emit('submit', formState.value)
        resetForm()
      }

      const cancel = () => {
        resetForm()
        emit('cancel')
      }

      // Watchers
      watch(
        () => props.item,
        val => {
          if (val) setFormFields(val)
        },
        { immediate: true, deep: true }
      )

      // Lifecycle
      onMounted(() => {
        initialFormState.value = JSON.stringify(formState.value)
      })

      return {
        form,
        v$,
        formChanged,
        getNameErrors,
        getFullNameErrors,
        submit,
        cancel,
      }
    },
  }
</script>
<style scoped>
  .input-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
  }
</style>
