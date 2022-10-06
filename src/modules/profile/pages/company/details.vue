<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <div class="text-h4">
          {{ company.name }}
        </div>
        <div class="text-caption">ИНН: {{ company.inn }}</div>
        <v-divider />
        <app-company-settings :companyId="id" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppCompanySettings from '@/modules/profile/components/companySettings'

export default {
  name: 'CompanyDetails',
  components: {
    AppCompanySettings,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    company() {
      return this.$store.state.ProfileModule.myCompanies.find(
        (item) => item._id === this.id
      )
    },
  },
}
</script>
<style></style>
