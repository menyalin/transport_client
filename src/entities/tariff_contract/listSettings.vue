<template>
  <div class="wrapper">
    <v-autocomplete
      v-model="agreementsModel"
      label="Соглашения"
      multiple
      autoSelectFirst
      clearable
      itemValue="_id"
      itemTitle="name"

      hideDetails
      variant="outlined"
       density="compact"
      :items="agreementItems"
      :style="{ maxWidth: '600px' }"
    />
    <v-text-field
      v-model="searchStrModel"
      label="Поиск"

      hideDetails
      clearable
      variant="outlined"
       density="compact"
      :style="{ maxWidth: '300px' }"
    />
  </div>
</template>
<script>
import { computed } from 'vue'

export default {
  name: 'TariffContractListSettings',
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    agreementItems: Array,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const agreementsModel = computed({
      get: () => props.modelValue.agreements,
      set: (value) => emit('update:modelValue', { ...props.modelValue, agreements: value })
    })

    const searchStrModel = computed({
      get: () => props.modelValue.searchStr,
      set: (value) => emit('update:modelValue', { ...props.modelValue, searchStr: value })
    })

    return {
      agreementsModel,
      searchStrModel,
    }
  },
}
</script>
<style scoped>
  .wrapper {
    display: flex;
    flex-direction: row;
    gap: 15px;
    padding: 10px;
  }
</style>
