<template>
  <FormWrapper>
    <div class="text-h4">
      {{ company.name }}
    </div>
    <div class="text-caption">ИНН: {{ company.inn }}</div>
    <v-divider />
    <CompanyBaseFieldsForm :item="company" @submit="submitHandler" />
    <CompanySettings :companyId="id" />
  </FormWrapper>
</template>
<script>
import store from '@/store'
import router from '@/router'
import { computed } from 'vue'
import { FormWrapper } from '@/shared/ui'
import { CompanyService } from '@/shared/services'
import { CompanySettings, CompanyBaseFieldsForm } from '@/entities/company'

export default {
  name: 'CompanyDetails',
  components: {
    CompanySettings,
    CompanyBaseFieldsForm,
    FormWrapper,
  },
  props: {
    id: { type: String, required: true },
  },
  setup(props) {
    const company = computed(() => store.state.ProfileModule.myCompanies.find(item => item._id === props.id))

    async function submitHandler(formState) {
      const res = await CompanyService.updateOne(props.id, formState)
      if (res) router.push('/profile/settings')
    }

    return {
      company,
      submitHandler,
    }
  },
}
</script>
<style></style>
