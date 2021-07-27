<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <div v-if="loading">
          Загружаю...
        </div>
        <app-route-sheet-form
          v-else
          :routesheet="routeSheet"
          display-delete-btn
          @cancel="cancel"
          @submit="submit"
          @delete="deleteHandler"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppRouteSheetForm from '@/modules/profile/components/routeSheetForm'
import RouteSheetService from '../../services/routeSheet.service'

export default {
  name: 'RouteSheetDetails',
  components: {
    AppRouteSheetForm,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      routeSheet: null,
    }
  },
  async created() {
    this.loading = true
    this.routeSheet = await RouteSheetService.getById(this.id)
    this.loading = false
  },

  methods: {
    async submit(val) {
      this.loading = true
      this.routeSheet = await RouteSheetService.updateOne(this.id, val)
      this.loading = false
      this.$router.go(-1)
    },
    cancel() {
      this.$router.push({ name: 'RouteSheetList' })
    },
    async deleteHandler() {
      this.loading = true
      await RouteSheetService.deleteById(this.id)
      this.loading = false
      this.$router.go(-1)
    },
  },
}
</script>
<style></style>
