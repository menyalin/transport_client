<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <div v-if="loading">Загружаю...</div>
        <CarrierForm
          v-else
          :item="tkName"
          :loading="loading || agreementsLoading"
          :displayDeleteBtn="$store.getters.hasPermission('carrier:delete')"
          :agreementItems="agreementItems"
          @cancel="cancel"
          @submit="submit"
          @delete="deleteHandler"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { CarrierForm } from '@/entities/carrier'
import { useCarrierAgreements } from '@/entities/carrierAgreement'
import { CarrierService } from '@/shared/services'

export default {
  name: 'TkNameDetails',
  components: {
    CarrierForm,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup() {
    const { items: agreementItems, loading: agreementsLoading } = useCarrierAgreements()

    return { agreementsLoading, agreementItems }
  },
  data() {
    return {
      loading: false,
      tkName: null,
    }
  },
  async created() {
    this.loading = true
    this.tkName = await CarrierService.getById(this.id)
    this.loading = false
  },

  methods: {
    async submit(val) {
      this.loading = true
      this.tkName = await CarrierService.updateOne(this.id, val)
      this.loading = false
      this.$router.go(-1)
    },
    cancel() {
      this.$router.push({ name: 'CarrierList' })
    },
    async deleteHandler() {
      const res = await this.$confirm('Вы действительно хотите удалить запись? ')
      if (res) {
        this.loading = true
        await CarrierService.deleteById(this.id)
        this.loading = false
        this.$router.go(-1)
      }
    },
  },
}
</script>
<style></style>
