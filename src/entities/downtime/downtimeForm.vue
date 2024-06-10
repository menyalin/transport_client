<template>
  <div>
    <buttons-panel
      panel-type="form"
      :disabled-submit="
        !$store.getters.hasPermission('downtime:write') || isInvalidForm
      "
      @cancel="cancel"
      @submit="submit"
    />
    <v-alert v-if="!directoriesProfile" outlined class="ma-3 mb-5" type="error">
      Профиль справочников не выбран, сохранение не возможно
    </v-alert>

    <v-autocomplete
      v-model="$v.form.truck.$model"
      label="Грузовик"
      :items="trucks"
      auto-select-first
      outlined
      dense
    />
    <v-select
      v-model="$v.form.type.$model"
      label="Тип простоя"
      :items="downtimeTypes"
      outlined
      dense
    />
    <v-text-field
      v-model.trim="$v.form.title.$model"
      outlined
      label="Заголовок"
      dense
    />
    <app-partner-autocomplete
      v-if="form.type === 'repair'"
      v-model="form.partner"
      label="Партнер"
      showHint
      onlyServices
      outlined
    />
    <app-address-autocomplete
      v-if="form.type === 'repair'"
      v-model="form.address"
      pointType="service"
      label="Адрес"
      outlined
      dense
    />
    <div class="row-input my-4">
      <DateTimeInput
        v-model="$v.form.startPositionDate.$model"
        label="Дата начала"
        outlined
        dense
        :style="{ 'max-width': '200px' }"
      />
      <DateTimeInput
        v-model="$v.form.endPositionDate.$model"
        label="Дата завешения"
        :minDate="form.startPositionDate"
        outlined
        dense
        :style="{ 'max-width': '200px' }"
      />
    </div>
    <v-text-field
      v-model="$v.form.note.$model"
      label="Примечание"
      outlined
      hide-details
      dense
    />
    <v-checkbox
      v-model="form.inOrderTime"
      label="Разрешить пересечение с рейсом"
    />
    <v-btn v-if="displayDeleteBtn" color="error" @click="$emit('delete')">
      <v-icon left dark> mdi-delete </v-icon>
      Удалить
    </v-btn>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import { isLaterThan } from '@/modules/common/helpers/dateValidators.js'
import { ButtonsPanel, DateTimeInput } from '@/shared/ui'
import AppAddressAutocomplete from '@/modules/common/components/addressAutocomplete'
import AppPartnerAutocomplete from '@/modules/common/components/partnerAutocomplete'

export default {
  name: 'DowntimeForm',
  components: {
    ButtonsPanel,
    DateTimeInput,
    AppPartnerAutocomplete,
    AppAddressAutocomplete,
  },
  props: {
    downtime: { type: Object },
    displayDeleteBtn: { type: Boolean, default: false },
    openInModal: { type: Boolean, default: false },
  },
  data() {
    return {
      form: {
        title: null,
        truck: null,
        type: null,
        note: null,
        partner: null,
        address: null,
        startPositionDate: null,
        endPositionDate: null,
        inOrderTime: false,
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
      return this.myCompanies.find(
        (item) => item._id === this.directoriesProfile
      ).name
    },

    formState() {
      return { ...this.form, company: this.directoriesProfile }
    },
    trucks() {
      return this.$store.getters.trucks
        .filter((item) => item.type === 'truck')
        .map((item) => ({ value: item._id, text: item.regNum }))
    },
    downtimeTypes() {
      return this.$store.getters.downtimeTypes
    },
  },
  watch: {
    downtime: {
      immediate: true,
      handler: function (val) {
        if (val) this.setFormFields(val)
      },
    },
  },

  validations() {
    return {
      form: {
        title: { required },
        truck: { required },
        type: { required },
        note: {},
        startPositionDate: { required },
        endPositionDate: {
          required,
          isLaterThan: isLaterThan(this.form.startPositionDate),
        },
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
      keys.forEach((key) => {
        this.form[key] = val[key]
      })
    },
    resetForm() {
      const keys = Object.keys(this.form)
      keys.forEach((key) => {
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
  gap: 15px;
  justify-content: flex-start;
}
</style>
