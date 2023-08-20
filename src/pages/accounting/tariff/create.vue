<template>
  <form-wrapper :loading="loading" @delete="deleteHandler">
    <div class="text-h5 ma-3">Создать группу тарифов</div>

    <div class="pt-1">
      <buttons-panel
        panel-type="form"
        :disabled-submit="
          !$store.getters.hasPermission('tariff:write') || disabledSubmit
        "
        @cancel="cancel"
        @submit="submit"
      />
      <tariff-list-settings v-model="settings" :disabled="disabledSettings" />
      <v-btn
        color="primary"
        small
        class="ma-2"
        hint="alt + N"
        :disabled="!allowCreateTariffItem"
        @click="addBtnHandler"
      >
        Добавить тариф alt+N
      </v-btn>
      <tariff-form
        v-model="editableTariff"
        :dialog="dialog"
        @cancel="closeDialog"
        @push="pushItem"
      />
      <tariff-group-list v-model="items" @removeItem="deleteItem" />
    </div>
  </form-wrapper>
</template>
<script>
import { ButtonsPanel, FormWrapper } from '@/shared/ui'
import AppLoadSpinner from '@/modules/common/components/appLoadSpinner'

import {
  TariffForm,
  TariffGroupList,
  TariffListSettings,
} from '@/entities/tariff'
import { TariffService } from '@/shared/services'

export default {
  name: 'CreateTariff',
  components: {
    FormWrapper,
    ButtonsPanel,
    AppLoadSpinner,
    TariffListSettings,
    TariffGroupList,
    TariffForm,
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
      return !!this.settings.date && !!this.settings.agreement
    },
    disabledSettings() {
      return this.items.length > 0
    },
    disabledSubmit() {
      return this.items.length === 0
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
        await TariffService.create(
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
          this.$store.commit('setError', e.message)
        }
      }
    },
  },
}
</script>
<style></style>
