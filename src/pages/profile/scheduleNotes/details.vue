<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-alert
          v-model="error.show"
          closable
          type="error"
          @change="toggleAlert"
        >
          {{ error.message }}
        </v-alert>
        <LoadSpinner v-if="loading" />
        <ScheduleNoteForm
          v-else
          :scheduleNote="item"
          :displayDeleteBtn="
            !!id && $store.getters.hasPermission('scheduleNote:delete')
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

import { ScheduleNoteForm } from '@/entities/scheduleNote'
import pageDetailsMixin from '@/modules/common/mixins/pageDetailsMixin'
import { ScheduleNoteService } from '@/shared/services'
import { LoadSpinner } from '@/shared/ui'

export default defineComponent({
  name: 'ScheduleNoteDetails',
  components: {
    ScheduleNoteForm,
    LoadSpinner,
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
})
</script>
<style></style>
