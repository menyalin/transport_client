<template>
  <form-wrapper>
    <AutoFillRouteDates />
  </form-wrapper>
</template>

<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'

import { AutoFillRouteDates } from '@/features/order'
import { FormWrapper } from '@/shared/ui'

export default defineComponent({
  name: 'AutofillDatesPage',
  components: {
    FormWrapper,
    AutoFillRouteDates,
  },
  setup() {},
})
</script>
