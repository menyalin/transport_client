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
        <app-downtime-form
          v-else
          :downtime="item"
          :displayDeleteBtn="
            !!id && $store.getters.hasPermission('downtime:delete')
          "
          @cancel="cancel"
          @submit="submit"
          @delete="deleteHandler"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppDowntimeForm from '@/modules/profile/components/downtimeForm'
import AppLoadSpinner from '@/modules/common/components/appLoadSpinner'
import { DowntimeService}  from '@/shared/services'
import pageDetailsMixin from '@/modules/common/mixins/pageDetailsMixin'

export default {
  name: 'DowntimeDetails',
  components: {
    AppDowntimeForm,
    AppLoadSpinner,
  },
  mixins: [pageDetailsMixin],
  props: {
    truckId: String,
    startDate: String,
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
