<template>
  <div id="points-wrapper">
    <v-autocomplete
      ref="loadingEl"
      :value="points.loading"
      :items="loadingAddressItems"
      label="Погрузка"
      dense
      outlined
      hide-details
      @change="changeHandler($event, 'loading')"
    />
    <v-autocomplete
      :value="points.unloading"
      :items="unloadingAddressItems"
      label="Разгрузка"
      dense
      outlined
      hide-details
      @change="changeHandler($event, 'unloading')"
    />
  </div>
</template>

<script>
import { ref, computed, getCurrentInstance } from 'vue'

export default {
  name: 'TariffPointsType',
  model: {
    prop: 'points',
    event: 'change',
  },
  props: {
    points: {
      type: Object,
      default: () => ({ loading: null, unloading: null }),
    },
  },
  emits: ['change'],
  setup(props, ctx) {
    const loadingEl = ref(null)
    const instance = getCurrentInstance()
    const store = instance?.proxy.$store

    const loadingAddressItems = computed(
      () => store?.getters.addressesForAutocomplete?.filter((i) => i.loading) || []
    )

    const unloadingAddressItems = computed(
      () => store?.getters.addressesForAutocomplete?.filter((i) => i.unloading) || []
    )

    function changeHandler(value, field) {
      console.log('props.points', props.points)
      ctx.emit('change', { ...props.points, [field]: value })
    }

    const focus = () => {
      loadingEl.value?.focus()
    }

    return {
      changeHandler,
      loadingAddressItems,
      unloadingAddressItems,
      loadingEl,
      focus,
    }
  },
}
</script>
<style scoped>
#points-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
