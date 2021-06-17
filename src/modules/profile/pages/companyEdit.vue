<template>
  <v-container>
    <app-company-form @cancel="cancel" />
  </v-container>
</template>
<script>
import AppCompanyForm from '@/modules/profile/components/companyForm'

export default {
  name: 'CompanyEdit',
  components: {
    AppCompanyForm,
  },
  methods: {
    cancel() {
      this.$router.push({ name: 'companyList' })
    },
  },
}
</script>
<style></style>
