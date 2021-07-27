<template>
  <v-autocomplete
    clearable
    outlined
    dense
    auto-select-first
    return-object
    :value="model"
    :items="[...items, ...tmpItems]"
    hide-no-data
    :loading="isLoading"
    :search-input.sync="search"
    :filter="() => true"
    :label="label"
    placeholder="Введите текст для поиска"
    no-data-text="Данные не найдены"
    :disabled="disabled"
    item-value="_id"
    item-text="text"
    @change="change"
    @click:clear="clear"
  />
</template>
<script>
import { mapGetters } from 'vuex'
import DriverService from '../../services/driver.service'

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
  computed: {
    ...mapGetters(['directoriesProfile']),
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
      const res = await DriverService.search(str, this.directoriesProfile)
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
      if (!!val) {
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
