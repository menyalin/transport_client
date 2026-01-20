<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <CrewForm
          :loading="loading"
          :carrierItems="carrierStore.carriers"
          :disabledSubmit="!$store.getters.hasPermission('crew:write')"
          @submit="submit"
          @cancel="cancel"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { useCarrierStore } from '@/entities/carrier'
import { CrewForm } from '@/entities/crew'

export default {
  name: 'CrewCreate',
  components: {
    CrewForm,
  },
  data() {
    return {
      loading: false,
    }
  },
  setup() {
    const carrierStore = useCarrierStore()
    return {
      carrierStore,
    }
  },
  methods: {
    submit(item) {
      this.loading = true
      this.$store
        .dispatch('createCrew', item)
        .then(() => {
          this.loading = false
          this.$router.push({ name: 'CrewList' })
        })
        .catch((e) => {
          this.loading = false
          this.$store.commit('setError', e)
        })
    },
    cancel() {
      this.$router.go(-1)
    },
  },
}
</script>
<style></style>
