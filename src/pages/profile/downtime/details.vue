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
        <LoadSpinner v-if="loading" />
        <DowntimeForm
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
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'

import { DowntimeForm } from '@/entities/downtime'
import pageDetailsMixin from '@/modules/common/mixins/pageDetailsMixin'
import { DowntimeService } from '@/shared/services'
import { LoadSpinner } from '@/shared/ui'

export default defineComponent({
  name: 'DowntimeDetails',
  components: {
    DowntimeForm,
    LoadSpinner,
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
})
</script>
<style></style>
