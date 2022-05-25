<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-load-spinner v-if="loading" />
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
import AppLoadSpinner from '@/modules/common/components/appLoadSpinner'
import service from '../../services/city.service'
import pageDetailsMixin from '@/modules/common/mixins/pageDetailsMixin'

export default {
  name: 'RegionDetails',
  components: {
    AppCityForm,
    AppLoadSpinner,
  },
  mixins: [pageDetailsMixin],
  data() {
    return {
      service: service,
    }
  },
}
</script>
