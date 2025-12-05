<template>
  <div class="agreements-wrapper">
    <div v-for="item of agreementItems" :key="item._id">
      {{ item.agreementName }}
    </div>
  </div>
</template>
<script>
import { computed } from 'vue'
export default {
  name: 'CarrierListAgreementsCell',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    agreementsData: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const agreementMap = computed(() => {
      return new Map(props.agreementsData.map(i => [i._id, i.name]))
    })
    const agreementItems = computed(() => {
      return props.items.map(i => ({
        ...i,
        agreementName: agreementMap.value.get(i.agreement) ?? '',
      }))
    })
    return {
      agreementItems,
    }
  },
}
</script>
