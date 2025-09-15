<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <load-spinner v-if="loading" />
        <app-city-form
          v-else
          :city="item"
          :displayDeleteBtn="
            !!id && $store.getters.hasPermission('city:delete')
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
import AppCityForm from '@/modules/profile/components/cityForm'
import { LoadSpinner } from '@/shared/ui'
import { CityService } from '@/shared/services'
import pageDetailsMixin from '@/modules/common/mixins/pageDetailsMixin'

export default {
  name: 'RegionDetails',
  components: {
    AppCityForm,
    LoadSpinner,
  },
  mixins: [pageDetailsMixin],
  data() {
    return {
      service: CityService,
    }
  },
}
</script>
