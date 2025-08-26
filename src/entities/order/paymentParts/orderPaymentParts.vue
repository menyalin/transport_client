<template>
  <div class="docs-wrapper">
    <h5>Деление стоимости рейса:</h5>
    <div class="btn-wrapper">
      <v-btn
        text
        small
        color="primary"
        outlined
        :loading="loading"
        @click="openDialog"
        :disabled="loading || readonly"
      >
        Добавить часть
      </v-btn>
    </div>
    <div v-if="loading">Загружаю...</div>
    <payment-parts-table
      v-else
      :items="preparedItems"
      :hideDelete="readonly || loading"
      @deleteRow="deleteRowHandler"
    />
    <payment-part-form-dialog
      :routeDate="routeDate"
      :dialog="dialog"
      @submit="submitHandler"
      @close="closeDialog"
    />
  </div>
</template>
<script>
import { AgreementService } from '@/shared/services/index'
import PaymentPartFormDialog from './formDialog.vue'
import PaymentPartsTable from './paymentPartsTable.vue'

export default {
  name: 'OrderPaymentParts',
  components: {
    PaymentPartFormDialog,
    PaymentPartsTable,
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: Array,
    },
    routeDate: { type: String },
    readonly: {
      type: Boolean,
    },
  },
  data() {
    return {
      loading: false,
      agreements: [],
      parts: [],
      dialog: false,
    }
  },
  computed: {
    clientsInParts() {
      return this.parts.map((i) => i.client)
    },
    preparedItems() {
      return this.parts.map((part) => {
        const agreement = this.agreements.find(
          (agreement) => agreement._id === part.agreement
        )
        return {
          ...part,
          agreementName: agreement?.name || '__no name__',
        }
      })
    },
  },

  watch: {
    value: {
      deep: true,
      immediate: true,
      handler: function (val, oldVal) {
        if (JSON.stringify(val) === JSON.stringify(oldVal)) return null
        this.parts = val
      },
    },
    parts: {
      deep: true,
      handler: function (val) {
        this.$emit('change', val)
      },
    },
    clientsInParts: {
      deep: true,
      immediate: true,
      handler: async function (newVal, oldVal) {
        if (
          Array.isArray(newVal) &&
          newVal.some((i) => !Array.isArray(oldVal) || !oldVal.includes(i))
        )
          await this.getAgreements()
      },
    },
  },
  methods: {
    submitHandler(formState) {
      if (this.readonly) return
      this.parts.push(formState)
      this.closeDialog()
    },
    openDialog() {
      this.dialog = true
    },
    closeDialog() {
      this.dialog = false
    },
    deleteRowHandler(idx) {
      this.parts.splice(idx, 1)
    },

    async getAgreements() {
      try {
        this.loading = true
        const res = await AgreementService.getForClient({
          company: this.$store.getters.directoriesProfile,
          date: this.routeDate,
          clients: this.clientsInParts,
        })
        this.agreements = Object.assign([], res)
      } catch (e) {
        console.log('Ошибка получения соглашений для частей рейса: ', e)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
<style scoped>
.docs-wrapper {
  margin: 5px;
  padding: 15px;
}
.invalid {
  border: tomato 2px solid;
  border-radius: 5px;
}
.btn-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 15px;
  align-items: center;
  margin: 10px;
}
.not-accepted {
  background-color: rgba(255, 0, 0, 0.4);
}
</style>
