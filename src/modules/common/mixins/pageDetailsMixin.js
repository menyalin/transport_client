export default {
  props: {
    id: String,
    openInModal: { type: Boolean, default: false },
  },
  data() {
    return {
      item: null,
      loading: false,
      tmpVal: null,
      error: {
        message: null,
        show: false,
      },
    }
  },

  watch: {
    id: {
      immediate: true,
      handler: async function (newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          this.loading = true
          this.item = await this.service.getById(newVal)
          this.loading = false
        }
      },
    },
  },
  methods: {
    toggleAlert() {
      this.error = {
        show: false,
        message: null,
      }
    },
    async submit(val) {
      this.tmpVal = val
      try {
        this.loading = true
        if (this.id) {
          this.item = await this.service.updateOne(this.id, val)
        } else this.item = await this.service.create(val)
        this.loading = false
        this.tmpVal = null
        if (this.openInModal) this.$emit('submit', this.item._id)
        else this.$router.go(-1)
      } catch (e) {
        this.loading = false
        this.item = this.tmpVal
        if (e.response.status === 400 || e.response.status === 403) {
          this.error.message = e.response.data
          this.error.show = true
        }
      }
    },

    cancel() {
      if (this.openInModal) this.$emit('cancel')
      else this.$router.go(-1)
    },

    async deleteHandler() {
      const res = await this.$dialog.confirm(
        'Вы действительно хотите удалить запись? '
      )
      if (res) {
        try {
          this.loading = true
          await this.service.deleteById(this.id)
          this.loading = false
          this.$router.go(-1)
        } catch (e) {
          this.loading = false
          this.$store.commit('setError', e.message)
        }
      }
    },
  },
}
