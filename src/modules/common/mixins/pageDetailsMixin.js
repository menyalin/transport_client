export default {
  props: {
    id: String,
    openInModal: { type: Boolean, default: false },
  },
  data() {
    return {
      item: null,
      loading: false,
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
    async submit(val) {
      this.loading = true
      if (this.id) {
        this.item = await this.service.updateOne(this.id, val)
      } else this.item = await this.service.create(val)
      this.loading = false
      if (this.openInModal) this.$emit('submit', this.item._id)
      else this.$router.go(-1)
    },

    cancel() {
      if (this.openInModal) this.$emit('cancel')
      else this.$router.go(-1)
    },

    async deleteHandler() {
      const res = await this.$confirm(
        'Вы действительно хотите удалить запись? '
      )
      if (res) {
        this.loading = true
        await this.service.deleteById(this.id)
        this.loading = false
        this.$router.go(-1)
      }
    },
  },
}
