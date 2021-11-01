export default () => {
  return {
    data() {
      return {
        needFormCache: true,
        formCache: null,
      }
    },
    created() {
      if (this.$store.getters.formCacheMap.has(this.formName))
        this.formCache = {
          ...this.$store.getters.formCacheMap.get(this.formName),
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
        this.$store.commit('deleteFormCache', this.formName)
      },

      cancel() {
        this.needFormCache = false
        this.clearCache()
        this.$router.go(-1)
      },
    },
  }
}
