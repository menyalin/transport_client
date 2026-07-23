<template>
  <form-wrapper>
    <div class="text-h4">{{ company.name }}</div>
    <div class="text-caption">ИНН: {{ company.inn }}</div>
    <v-divider />
    <company-base-fields-form :item="company" @submit="submitHandler" />
    <company-settings :company-id="id" />
  </form-wrapper>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { FormWrapper } from '@/shared/ui'
import { CompanyService } from '@/shared/services'
import { CompanySettings, CompanyBaseFieldsForm } from '@/entities/company'

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
