<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <div v-if="loading">Загружаю...</div>
        <app-tkname-form
          v-else
          :tkName="tkName"
          :displayDeleteBtn="$store.getters.hasPermission('tkName:delete')"
          @cancel="cancel"
          @submit="submit"
          @delete="deleteHandler"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppTknameForm from '@/modules/profile/components/tkNameForm'
import service from '../../services/tkName.service'
export default {
  name: 'TkNameDetails',
  components: {
    AppTknameForm,
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
      tkName: null,
    }
  },
  async created() {
    this.loading = true
    this.tkName = await service.getById(this.id)
    this.loading = false
  },

  methods: {
    async submit(val) {
      this.loading = true
      this.tkName = await service.updateOne(this.id, val)
      this.loading = false
      this.$router.go(-1)
    },
    cancel() {
      this.$router.push({ name: 'TkNameList' })
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
