<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <div v-if="loading">
          Загружаю...
        </div>
        <app-crew-form
          v-else
          :crew="crew"
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
import AppCrewForm from '@/modules/profile/components/crewForm'
import service from '../../services/crew.service'

export default {
  name: 'CrewDetails',
  components: {
    AppCrewForm,
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
      crew: null,
    }
  },
  async created() {
    this.loading = true
    this.crew = await service.getById({ id: this.id, forEdit: true })
    this.loading = false
  },

  methods: {
    async submit(val) {
      this.loading = true
      this.crew = await service.updateOne(this.id, val)
      this.loading = false
      this.$router.go(-1)
    },
    cancel() {
      this.$router.go(-1)
    },
    async deleteHandler() {
      const res = await this.$confirm(
        'Вы действительно хотите удалить запись? '
      )
      if (res) {
        this.loading = true
        await service.deleteById(this.id)
        this.loading = false
        this.$router.go(-1)
      }
    },
  },
}
</script>
<style></style>
