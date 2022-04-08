<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <div class="text-h4">
          {{ company.name }}
        </div>
        <div class="text-caption">
          ИНН: {{ company.inn }}
        </div>
        <v-divider />
        <app-company-settings :companyId="id" />
        <app-company-staff
          :staff="company.staff"
          :company-id="company._id"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppCompanyStaff from '@/modules/profile/components/companyStaff'
import AppCompanySettings from '@/modules/profile/components/companySettings'

export default {
  name: 'CompanyDetails',
  components: {
    AppCompanyStaff,
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
