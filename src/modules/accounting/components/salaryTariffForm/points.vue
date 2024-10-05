<template>
  <div id="points-wrapper">
    <v-autocomplete
      ref="loadingEl"
      v-model="state.loading"
      :items="loadingAddressItems"
      pointType="loading"
      label="Погрузка"
      dense
      outlined
      hide-details
    />
    <v-autocomplete
      v-model="state.unloading"
      :items="unloadingAddressItems"
      label="Разгрузка"
      pointType="unloading"
      dense
      outlined
      hide-details
    />
  </div>
</template>
<script>
import store from '@/store'
import { ref, computed, watch } from 'vue'

export default {
  name: 'TariffPointsType',

  model: {
    prop: 'points',
    event: 'change',
  },
  props: {
    points: Object,
  },
  setup(props) {
    const initialState = { loading: null, unloading: null }
    const state = ref(props.points ? { ...props.points } : initialState)

    const loadingAddressItems = computed(() => {
      return store.getters.addressesForAutocomplete.filter((i) => i.loading)
    })
    const unloadingAddressItems = computed(() => {
      return store.getters.addressesForAutocomplete.filter((i) => i.unloading)
    })
    watch(
      () => props.points,
      (val) => {
        state.value = { ...val }
      },
      { deep: true }
    )
    return { state, loadingAddressItems, unloadingAddressItems }
  },
  data() {
    return {
      tmpPoints: {
        loading: null,
        unloading: null,
      },
    }
  },

  methods: {
    focus() {
      this.$refs.loadingEl.focus()
    },
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
