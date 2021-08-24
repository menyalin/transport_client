<template>
  <div>
    <app-buttons-panel
      :disabled-submit="isInvalidForm || loading"
      panel-type="form"
      @cancel="cancel"
      @submit="submit"
    />
    <v-alert
      v-if="!directoriesProfile"
      outlined
      class="ma-3 mb-5"
      type="error"
    >
      Профиль справочников не выбран, сохранение не возможно
    </v-alert>
    <div
      v-else
      class="ma-3 text-caption"
    >
      Профиль настроек: {{ directoriesProfileName }}
    </div>
  </div>
</template>
<script>
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import { mapGetters } from 'vuex'
export default {
  name: 'OrderForm',
  components: {
    AppButtonsPanel,
  },
  data() {
    return {
      loading: false,
      form: {},
    }
  },
  computed: {
    ...mapGetters(['directoriesProfile', 'myCompanies']),
    isInvalidForm() {
      if (!this.directoriesProfile) return true
      return this.$v.$invalid
    },
    directoriesProfileName() {
      if (!this.directoriesProfile) return null
      return this.myCompanies.find(
        (item) => item._id === this.directoriesProfile
      )?.name
    },
  },
  methods: {
    submit() {
      console.log('submit form')
    },
    cancel() {
      this.$emit('cancel')
    },
  },
  validations: {
    form: {},
  },
}
</script>
<style></style>
