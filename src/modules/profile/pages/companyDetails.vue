<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="text-h4">
          {{ company.name }}
          
        </div>
        <div class="text-caption">ИНН: {{ company.inn }}</div>
        <v-divider />
        <app-company-staff :staff="company.staff"  :companyId="company._id"/>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppCompanyStaff from '@/modules/profile/components/companyStaff'


export default {
  name: 'CompanyDetails',
  components: {
    AppCompanyStaff,
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
