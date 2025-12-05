<template>
  <div>
    <ButtonsPanel
      panelType="form"
      :disabledSubmit="!$store.getters.hasPermission('scheduleNote:write') || isInvalidForm"
      @cancel="cancel"
      @submit="submit"
    />
    <v-alert v-if="!directoriesProfile" variant="outlined" class="ma-3 mb-5" type="error" density="compact">
      Профиль справочников не выбран, сохранение не возможно
    </v-alert>

    <v-autocomplete v-model="$v.form.truck.$model" label="Грузовик" :items="trucks" variant="outlined" />
    density="compact"
    <v-text-field v-model.trim="$v.form.text.$model" variant="outlined" label="Текст" density="compact" />
    <v-select v-model="form.priority" label="Приоритет" :items="priorityItems" variant="outlined" />
    density="compact"

    <DateTimeInput
      v-model="$v.form.startPositionDate.$model"
      label="Дата начала"
      dense
      outlined
      type="datetime-local"
      :style="{ maxWidth: '300px' }"
    />
    <v-btn v-if="displayDeleteBtn" class="mt-5" color="error" @click="$emit('delete')">
      <v-icon start>mdi-delete</v-icon>
      Удалить
    </v-btn>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { required } from '@vuelidate/validators'

  import { ButtonsPanel, DateTimeInput } from '@/shared/ui'

  export default {
    name: 'ScheduleNoteForm',
    components: {
      ButtonsPanel,
      DateTimeInput,
    },
    props: {
      scheduleNote: {
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
    data() {
      return {
        priorityItems: [
          { value: 'low', text: 'Обычный' },
          { value: 'middle', text: 'Средний' },
          { value: 'high', text: 'Высокий' },
        ],
        form: {
          text: null,
          truck: null,
          startPositionDate: null,
          priority: 'low',
        },
      }
    },

    computed: {
      ...mapGetters(['myCompanies', 'directoriesProfile']),
      isInvalidForm() {
        if (!this.directoriesProfile) return true
        return this.$v.$invalid
      },
      directoriesProfileName() {
        if (!this.directoriesProfile) return null
        return this.myCompanies.find(item => item._id === this.directoriesProfile).name
      },

      formState() {
        return { ...this.form, company: this.directoriesProfile }
      },
      trucks() {
        return this.$store.getters.trucks
          .filter(item => item.type === 'truck')
          .map(item => ({ value: item._id, text: item.regNum }))
      },
    },
    watch: {
      scheduleNote: {
        immediate: true,
        handler: function (val) {
          if (val) this.setFormFields(val)
        },
      },
    },

    validations() {
      return {
        form: {
          text: { required },
          truck: { required },
          startPositionDate: { required },
        },
      }
    },

    methods: {
      submit() {
        this.$emit('submit', this.formState)
        this.resetForm()
      },
      cancel() {
        this.resetForm()
        this.$emit('cancel')
      },
      setFormFields(val) {
        const keys = Object.keys(this.form)
        keys.forEach(key => {
          this.form[key] = val[key]
        })
      },
      resetForm() {
        const keys = Object.keys(this.form)
        keys.forEach(key => {
          this.form[key] = null
        })
      },
    },
  }
</script>
<style>
  .row-input {
    display: flex;
    flex-direction: row;
  }
</style>
