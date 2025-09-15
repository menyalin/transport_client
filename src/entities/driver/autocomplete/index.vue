<template>
  <v-autocomplete
    clearable
    variant="outlined"
    density="compact"
    auto-select-first
    return-object
    :value-model="model"
    :items="[...items, ...tmpItems]"
    hide-no-data
    :loading="isLoading"
    :search="search"
    :customFilter="() => true"
    :label="label"
    placeholder="Введите текст для поиска"
    no-data-text="Данные не найдены"
    :disabled="disabled"
    item-value="_id"
    item-title="text"
    @update:model-value="change"
    @click:clear="clear"
  />
</template>
<script>
import { DriverService } from '@/shared/services'

const _getDriverNameString = (driver) => {
  return driver?.surname + ' ' + driver?.name
}

export default {
  name: 'DriverAutocomplete',
  model: {
    prop: 'driverId',
    event: 'change',
  },
  props: {
    driverId: {
      type: String,
    },
    label: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      model: null,
      search: null,
      isLoading: false,
      items: [],
      tmpItems: [],
      timeout: null,
    }
  },

  watch: {
    async search(val, oldVal) {
      if (!val || !val?.trim() || oldVal === val) {
        return
      }
      if (this.isLoading) return
      if (this.timeout) clearTimeout(this.timeout)
      this.timeout = setTimeout(async () => {
        try {
          this.isLoading = true
          this.items = await this.getItems(val)
          this.isLoading = false
        } catch (e) {
          this.isLoading = false
          this.$store.commit('setError', e.message)
        }
      }, 500)
    },
  },
  created() {
    if (this.driverId) {
      this.getById()
    }
  },
  methods: {
    async getItems(str) {
      const res = await DriverService.search(
        str,
        this.$store.getters.directoriesProfile
      )
      return res.map((item) => ({
        ...item,
        text: _getDriverNameString(item),
      }))
    },
    async getById() {
      try {
        this.isLoading = true
        let res = await DriverService.getById(this.driverId)
        res = { ...res, text: _getDriverNameString(res) }
        this.tmpItems.push(res)
        this.model = res
        this.isLoading = false
      } catch (e) {
        this.$store.commit('setError', e.message)
        this.isLoading = false
      }
    },
    change(val) {
      if (val) {
        this.tmpItems = []
        this.tmpItems.push(val)
        this.model = val
        this.$emit('change', val._id)
      }
    },
    clear() {
      this.model = null
      this.items = []
      this.tmpItems = []
      this.$emit('change', null)
    },
  },
}
</script>
<style></style>
