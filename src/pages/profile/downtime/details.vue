<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-alert
          v-model="error.show"
          dismissible
          type="error"
          transition="scale-transition"
          @change="toggleAlert"
        >
          {{ error.message }}
        </v-alert>
        <app-load-spinner v-if="loading" />
        <DowntimeForm
          v-else
          :downtime="item"
          :displayDeleteBtn="
            !!id && $store.getters.hasPermission('downtime:delete')
          "
          :addressActions="addressActions"
          :partnerActions="partnerActions"
          @cancel="cancel"
          @submit="submit"
          @delete="deleteHandler"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppLoadSpinner from '@/modules/common/components/appLoadSpinner'
import { DowntimeService } from '@/shared/services'
import pageDetailsMixin from '@/modules/common/mixins/pageDetailsMixin'
import { DowntimeForm } from '@/entities/downtime'
import { useAddress } from '@/entities/address'
import { usePartners } from '@/entities/partner'

export default {
  name: 'DowntimeDetails',
  components: {
    DowntimeForm,
    AppLoadSpinner,
  },
  mixins: [pageDetailsMixin],

  props: {
    truckId: String,
    startDate: String,
  },
  setup() {
    const { actions: addressActions } = useAddress()
    const { actions: partnerActions } = usePartners()
    return {
      addressActions,
      partnerActions,
    }
  },
  data() {
    return {
      service: DowntimeService,
    }
  },
  created() {
    if (this.startDate) {
      this.item = {
        startPositionDate: this.startDate,
        truck: this.truckId,
      }
    }
  },
}
</script>
<style></style>
