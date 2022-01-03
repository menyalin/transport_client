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
        <app-schedule-note-form
          v-else
          :scheduleNote="item"
          :displayDeleteBtn="!!id"
          @cancel="cancel"
          @submit="submit"
          @delete="deleteHandler"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppScheduleNoteForm from '@/modules/profile/components/scheduleNoteForm'
import AppLoadSpinner from '@/modules/common/components/appLoadSpinner'
import service from '../../services/scheduleNote.service'
import pageDetailsMixin from '@/modules/common/mixins/pageDetailsMixin'

export default {
  name: 'ScheduleNoteDetails',
  components: {
    AppScheduleNoteForm,
    AppLoadSpinner,
  },
  mixins: [pageDetailsMixin],
  props: {
    truckId: String,
    startDate: String,
  },
  data() {
    return {
      service: service,
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
