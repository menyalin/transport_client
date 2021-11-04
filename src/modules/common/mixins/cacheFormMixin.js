export default {
  props: {
    initFormName: String,
    fieldName: String,
    id: String,
  },
  data() {
    return {
      needFormCache: true,
      formCache: null,
      item: null,
      loading: false,
    }
  },
  async created() {
    if (this.$store.getters.formCacheMap.has(this.formName)) {
      this.formCache = {
        ...this.$store.getters.formCacheMap.get(this.formName),
      }
      this.clearCache()
    } else if (this.id) {
      this.loading = true
      this.item = await this.service.getById(this.id)
      this.loading = false
    }
  },
  methods: {
    saveToCache(val) {
      if (this.needFormCache)
        this.$store.commit('addFormToCache', {
          key: this.formName,
          form: val,
        })
    },
    clearCache() {
      if (this.$store.getters.formCacheMap.has(this.formName))
        this.$store.commit('deleteFormCache', this.formName)
    },
    updateCache(payload) {
      // payload -> { formName, fieldName, value }
      this.$store.commit('updateFormCache', payload)
    },
    cancel() {
      this.needFormCache = false
      this.clearCache()
      this.$router.go(-1)
    },

    async deleteHandler() {
      const res = await this.$confirm(
        'Вы действительно хотите удалить запись? '
      )
      if (res) {
        this.needFormCache = false
        this.loading = true
        await this.service.deleteById(this.id)
        this.clearCache()
        this.loading = false
        this.$router.go(-1)
      }
    },
  },
}
