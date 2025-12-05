<template>
  <FormWrapper>
    <AutoFillRouteDates />
  </FormWrapper>
</template>

<script>
import { FormWrapper } from '@/shared/ui'
import { AutoFillRouteDates } from '@/features/order'

export default {
  name: 'AutofillDatesPage',
  components: {
    FormWrapper,
    AutoFillRouteDates,
  },
  setup() {},
}
</script>
