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
        <div class="text-h5 ma-3">
          {{ id ? 'Редактировать группу тарифов' : 'Создать группу тарифов' }}
        </div>
        <app-load-spinner v-if="loading" />
        <div
          v-else
          class="pt-2"
        >
          <app-tariff-common-settings v-model="settings" />
          <v-btn
            color="primary"
            small
            class="ma-2"
            hint="alt + N"
            :disabled="!allowCreateTariffItem"
            @click="addTariff"
          >
            Добавить тариф alt+N
          </v-btn>
          <app-tariff-form
            v-model="editableTariff"
            :dialog="dialog"
            @cancel="closeDialog"
          />
          <app-tariff-group-list v-model="items" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppLoadSpinner from '@/modules/common/components/appLoadSpinner'
import AppTariffCommonSettings from '@/modules/profile/components/tariffCommonSettings'
import AppTariffGroupList from '@/modules/profile/components/tariffGroupList'
import AppTariffForm from '@/modules/profile/components/tariffForm'
import service from '../../services/tariff.service'

export default {
  name: 'DowntimeDetails',
  components: {
    AppLoadSpinner,
    AppTariffCommonSettings,
    AppTariffGroupList,
    AppTariffForm,
  },
  props: {
    id: String,
  },
  data() {
    return {
      keyPressListener: null,
      items: [],
      editableTariff: {},
      settings: {},
      dialog: false,
      item: null,
      loading: false,
      tmpVal: null,
      error: {
        message: null,
        show: false,
      },
    }
  },
  computed: {
    allowCreateTariffItem() {
      return this.settings.date && this.settings.agreement
    },
  },
  watch: {
    id: {
      immediate: true,
      handler: async function (newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          this.loading = true
          this.item = await this.service.getById(newVal)
          this.loading = false
        }
      },
    },
  },
  created() {
    document.addEventListener('keyup', this.keypressEventHandler)
  },
  beforeDestroy() {
    document.removeEventListener('keyup', this.keypressEventHandler)
  },
  methods: {
    keypressEventHandler(e) {
      if (e.altKey && (e.key === 'n' || e.key === 'т')) this.addTariff()
    },
    addTariff() {
      if (!this.allowCreateTariffItem) return null
      this.editableTariff = { ...this.settings }
      this.dialog = true
    },
    closeDialog() {
      this.dialog = false
    },
    toggleAlert() {
      this.error = {
        show: false,
        message: null,
      }
    },

    async submit(val) {
      this.tmpVal = val
      try {
        this.loading = true
        if (this.id) this.item = await service.updateOne(this.id, val)
        else this.item = await service.create(val)
        this.loading = false
        this.tmpVal = null
        this.$router.go(-1)
      } catch (e) {
        this.loading = false
        this.item = this.tmpVal
        if (e.response.status === 400 || e.response.status === 403) {
          this.error.message = e.response.data
          this.error.show = true
        }
      }
    },

    async deleteHandler() {
      const res = await this.$confirm(
        'Вы действительно хотите удалить запись? '
      )
      if (res) {
        try {
          this.loading = true
          await this.service.deleteById(this.id)
          this.loading = false
          this.$router.go(-1)
        } catch (e) {
          this.loading = false
          console.log(e)
          this.$store.commit('setError', e.message)
        }
      }
    },
  },
}
</script>
<style></style>
