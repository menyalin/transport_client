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
<script setup>
import { CompanyForm } from '@/entities/company'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

defineOptions({ name: 'CreateCompany' })

const store = useStore()
const router = useRouter()

function cancel() {
  router.push({ name: 'companyList' })
}

function submitForm(newCompany) {
  store.dispatch('createCompany', newCompany).then(() => {
    router.push({ name: 'companyList' })
  })
}
</script>
