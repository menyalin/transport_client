<template>
  <form-wrapper>
    <AutoFillRouteDates />
  </form-wrapper>
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
