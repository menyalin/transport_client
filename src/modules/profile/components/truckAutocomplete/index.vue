<template>
  <v-autocomplete
    clearable
    outlined
    dense
    hint="Поиск работает по цифрам номера"
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
import TruckService from '../../services/truck.service'

const _getTruckNameString = (truck) => {
  let resStr = ''
  if (truck.name) resStr += truck.name
  if (truck.liftCapacity === 0 && truck.allowUseTrailer) resStr += ' Тягач'
  if (truck.type === 'trailer') resStr += ' Прицеп'
  if (truck.regNum) resStr += ' гос.номер ' + truck.regNum
  if (truck.liftCapacity > 0)
    resStr += ' г/п: ' + truck.liftCapacity / 1000 + 'т.'
  if (truck.pltCount > 0) resStr += ' ' + truck.pltCount + 'плт'
  return resStr
}

export default {
  name: 'TruckAutocomplete',
  model: {
    prop: 'truckId',
    event: 'change',
  },
  props: {
    truckId: {
      type: String,
    },
    label: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: null,
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
    async search(val) {
      if (!val || !val?.trim()) {
        // this.model = null
        // this.items = []
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
    if (this.truckId) {
      this.getById()
    }
  },
  methods: {
    async getItems(str) {
      const res = await TruckService.search(
        str,
        this.type || null,
        this.directoriesProfile
      )
      return res.map((item) => ({
        ...item,
        text: _getTruckNameString(item),
      }))
    },
    async getById() {
      try {
        this.isLoading = true
        let res = await TruckService.getById(this.truckId)
        res = { ...res, text: _getTruckNameString(res) }
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
