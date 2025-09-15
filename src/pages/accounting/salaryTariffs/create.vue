<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-alert
          v-model="error.show"
          closable
          type="error"
          @update:model-value="toggleAlert"
        >
          {{ error.message }}
        </v-alert>
        <div class="text-h5 ma-3">
          {{ id ? 'Редактировать группу тарифов' : 'Создать группу тарифов' }}
        </div>
        <load-spinner v-if="loading" />
        <div v-else class="pt-2">
          <buttons-panel
            panel-type="form"
            :disabled-submit="!hasWritePermission || disabledSubmit"
            @cancel="cancel"
            @submit="submit"
          />
          <app-salary-tariff-settings
            v-model="settings"
            :disabled="disabledSettings"
          />
          <v-btn
            color="primary"
            size="small"
            class="ma-2"
            hint="alt + N"
            :disabled="!allowCreateTariffItem"
            @click="addBtnHandler"
          >
            Добавить тариф alt+N
          </v-btn>
          <app-salary-tariff-form
            v-model="editableTariff"
            :dialog="dialog"
            @cancel="closeDialog"
            @push="pushItem"
          />
          <app-salary-tariff-group-list
            v-model="items"
            @remove-item="deleteItem"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { LoadSpinner, ButtonsPanel } from '@/shared/ui'
import AppSalaryTariffSettings from '@/modules/accounting/components/salaryTariffSettings'
import AppSalaryTariffGroupList from '@/modules/accounting/components/salaryTariffGroupList'
import AppSalaryTariffForm from '@/modules/accounting/components/salaryTariffForm/index.vue'
import { SalaryTariffService } from '@/shared/services'

export default {
  name: 'CreateTariff',
  components: {
    ButtonsPanel,
    LoadSpinner,
    AppSalaryTariffSettings,
    AppSalaryTariffGroupList,
    AppSalaryTariffForm,
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
      return (
        this.settings.date &&
        Array.isArray(this.settings.tks) &&
        this.settings.tks.length
      )
    },
    disabledSettings() {
      return this.items.length > 0
    },
    disabledSubmit() {
      return this.items.length === 0
    },
    hasWritePermission() {
      return this.$store.getters.hasPermission('salaryTariff:write')
    },
  },
  watch: {
    id: {
      immediate: true,
      handler: async function (newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          this.loading = true
          this.item = await SalaryTariffService.getById(newVal)
          this.loading = false
        }
      },
    },
  },

  created() {
    document.addEventListener('keyup', this.keypressEventHandler)
  },
  beforeUnmount() {
    document.removeEventListener('keyup', this.keypressEventHandler)
  },
  methods: {
    deleteItem(ind) {
      this.items.splice(ind, 1)
    },
    keypressEventHandler(e) {
      if (e.altKey && (e.key === 'n' || e.key === 'т')) this.addBtnHandler()
    },
    addBtnHandler() {
      if (!this.allowCreateTariffItem) return null
      this.editableTariff = { ...this.settings }
      if (this.editableTariff.type === 'additionalPoints')
        this.editableTariff.includedPoints = 2
      this.dialog = false
      this.$nextTick(() => {
        this.dialog = true
      })
    },
    pushItem(item) {
      this.items.push(item)
      this.editableTariff = { ...this.settings }
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
    cancel() {
      this.$router.go(-1)
    },

    async submit() {
      try {
        this.loading = true
        await SalaryTariffService.create(
          this.items.map((i) => ({
            ...i,
            company: this.$store.getters.directoriesProfile,
          }))
        )
        this.loading = false
        this.$router.go(-1)
      } catch (e) {
        this.loading = false
        this.$store.commit('setError', e.message)
      }
    },

    async deleteHandler() {
      const res = await this.$dialog.confirm(
        'Вы действительно хотите удалить запись? '
      )
      if (res) {
        try {
          this.loading = true
          await SalaryTariffService.deleteById(this.id)
          this.loading = false
          this.$router.go(-1)
        } catch (e) {
          this.loading = false
          this.$store.commit('setError', e.message)
        }
      }
    },
  },
}
</script>
<style></style>
