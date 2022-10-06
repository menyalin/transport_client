<template>
  <v-container fluid>
    <v-row>
      <v-col />
    </v-row>
    <v-row>
      <v-col>
        <app-company-form @cancel="cancel" @submit="submitForm" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppCompanyForm from '@/modules/profile/components/companyForm'
import { mapActions } from 'vuex'

export default {
  name: 'CreateCompany',
  components: {
    AppCompanyForm,
  },
  methods: {
    ...mapActions(['createCompany']),
    cancel() {
      this.$router.push({ name: 'companyList' })
    },
    submitForm(newCompany) {
      this.createCompany(newCompany).then(() => {
        this.$router.push({ name: 'companyList' })
      })
    },
  },
}
</script>
<style></style>
