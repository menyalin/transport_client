<template>
  <FormWrapper>
    <div class="text-headline-large">{{ company.name }}</div>
    <div class="text-body-small">ИНН: {{ company.inn }}</div>
    <v-divider />
    <CompanyBaseFieldsForm :item="company" @submit="submitHandler" />
    <CompanySettings :company-id="id" />
  </FormWrapper>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { FormWrapper } from '@/shared/ui'
import { CompanyService } from '@/shared/services'
import { CompanySettings } from '@/features/company'
import { CompanyBaseFieldsForm } from '@/features/company'

defineOptions({ name: 'CompanyDetails' })

const props = defineProps({
  id: { type: String, required: true },
})

const store = useStore()
const router = useRouter()

const company = computed(() =>
  store.state.ProfileModule.myCompanies.find((item) => item._id === props.id)
)

async function submitHandler(formState) {
  const res = await CompanyService.updateOne(props.id, formState)
  if (res) router.push('/profile/settings')
}
</script>

<style></style>
