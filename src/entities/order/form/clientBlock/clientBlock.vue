<template>
  <div>
    <div>
      <BlockTitle>{{ title }}</BlockTitle>
    </div>
    <div class="client-block">
      <v-autocomplete
        :items="clientItems"
        v-model="model.client"
        label="Заказчик"
        :loading="loading"
        :messages="agreementNameSring"
        :error="!loading && !currentAgreement"
        @update:model-value="changeClientHandler"
        :disabled="agreementDisabled"
        :style="{ maxWidth: '350px' }"
      />

      <v-text-field
        v-model.trim="model.num"
        label="Номер заказа клиента"
        :errorMessages="numErrorMessages"
        :style="{ maxWidth: '150px' }"
      />
      <v-text-field
        v-model.trim="model.auctionNum"
        label="Номер аукциона"
        :errorMessages="auctionNumErrorMessages"
        :style="{ maxWidth: '150px' }"
      />
    </div>

    <v-btn
      v-if="showChangeAgreementBtn"
      color="primary"
      size="small"
      class="mb-3 ml-5"
      @click="changeAgreementHandler"
    >
      Изменить соглашение
    </v-btn>
  </div>
</template>
<script setup>
import { BlockTitle } from '@/entities/order'
import { useClientBlock } from './useClientBlock'
import { computed } from 'vue'

defineOptions({ name: 'ClientBlock' })
const model = defineModel({ type: Object })

const props = defineProps({
  title: String,
  routeDate: String,
  agreementDisabled: Boolean,
  orderConfirmed: Boolean,
  carrier: String,
  isValidNum: { type: Boolean, default: true },
  isValidAuctionNum: { type: Boolean, default: true },
})

const emits = defineEmits(['update-agreement', 'change', 'update:model-value'])

const {
  clientItems,
  agreementNameSring,
  currentAgreement,
  loading,
  changeClientHandler,
  changeAgreementHandler,
  showChangeAgreementBtn,
} = useClientBlock(model, props, emits)

const numErrorMessages = computed(() =>
  props.isValidNum ? [] : ['Номер заказа клиента не может быть пустым']
)

const auctionNumErrorMessages = computed(() =>
  props.isValidAuctionNum ? [] : ['Номер аукциона не может быть пустым']
)
</script>
<style scoped>
.client-block {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 10px;
}
</style>
