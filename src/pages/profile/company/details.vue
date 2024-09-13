<template>
  <form-wrapper>
    <div class="text-h4">
      {{ company.name }}
    </div>
    <div class="text-caption">ИНН: {{ company.inn }}</div>
    <v-divider />
    <company-base-fields-form :item="company" @submit="submitHandler" />
    <company-settings :companyId="id" />
  </form-wrapper>
</template>
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'
import { computed } from 'vue'

import { CompanySettings, CompanyBaseFieldsForm } from '@/entities/company'
import router from '@/router'
import { CompanyService } from '@/shared/services'
import { FormWrapper } from '@/shared/ui'
import store from '@/store'

export default defineComponent({
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
    const company = computed(() =>
      store.state.ProfileModule.myCompanies.find(
        (item) => item._id === props.id
      )
    )

    async function submitHandler(formState) {
      const res = await CompanyService.updateOne(props.id, formState)
      if (res) router.push('/profile/settings')
    }

    return {
      company,
      submitHandler,
    }
  },
})
</script>
<style></style>
