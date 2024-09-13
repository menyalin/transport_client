<template>
  <v-container fluid>
    <v-row>
      <v-col />
    </v-row>
    <v-row>
      <v-col>
        <company-form @cancel="cancel" @submit="submitForm" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'
import { mapActions } from 'vuex'

import { CompanyForm } from '@/entities/company'

export default defineComponent({
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
})
</script>
