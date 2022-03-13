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
        <app-order-template-form
          v-else
          :orderTemplate="item"
          :displayDeleteBtn="
            !!id && $store.getters.hasPermission('orderTemplate:delete')
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
import AppOrderTemplateForm from '@/modules/profile/components/orderTemplateForm'
import AppLoadSpinner from '@/modules/common/components/appLoadSpinner'
import service from '../../services/orderTemplate.service'
import pageDetailsMixin from '@/modules/common/mixins/pageDetailsMixin'

export default {
  name: 'OrderTemplateDetails',
  components: {
    AppOrderTemplateForm,
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
<style></style>
