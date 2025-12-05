<template>
  <v-container fluid>
    <v-row>
      <v-col />
    </v-row>
    <v-row>
      <v-col>
        <CompanyForm @cancel="cancel" @submit="submitForm" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { CompanyForm } from '@/entities/company'
import { mapActions } from 'vuex'

export default {
  name: 'CreateCompany',
  components: {
    CompanyForm,
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
