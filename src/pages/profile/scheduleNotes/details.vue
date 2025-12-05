<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-alert v-model="error.show" closable type="error"
 @change="toggleAlert">
          {{ error.message }}
        </v-alert>
        <AppLoadSpinner v-if="loading" />
        <ScheduleNoteForm
          v-else
          :scheduleNote="item"
          :displayDeleteBtn="!!id && $store.getters.hasPermission('scheduleNote:delete')"
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
import { ScheduleNoteService } from '@/shared/services'
import pageDetailsMixin from '@/modules/common/mixins/pageDetailsMixin'
import { ScheduleNoteForm } from '@/entities/scheduleNote'

export default {
  name: 'ScheduleNoteDetails',
  components: {
    ScheduleNoteForm,
    AppLoadSpinner,
  },
  mixins: [pageDetailsMixin],
  props: {
    truckId: String,
    startDate: String,
  },
  data() {
    return {
      service: ScheduleNoteService,
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
