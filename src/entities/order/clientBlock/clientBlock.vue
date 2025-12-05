<template>
  <div>
    <div>
      <BlockTitle>{{ title }}</BlockTitle>
    </div>
    <div class="client-block">
      <v-autocomplete
        v-model="state.client"
        :items="clientItems"
        label="Заказчик"
        variant="outlined"
       density="compact"
        :loading="loading"
        :messages="agreementNameSring"
        :error="!loading && !currentAgreement"
       
        :style="{ maxWidth: '400px' }"
        :disabled="agreementDisabled"
        @update:model-value="changeClientHandler"
      />

      <v-text-field
        v-model.trim="state.num"
        variant="outlined"
       density="compact"
       
        label="Номер заказа клиента"
        :errorMessages="numErrorMessages"
        :style="{ maxWidth: '250px' }"
        @change="changeFieldHandler($event, 'num')"
      />
      <v-text-field
        v-model.trim="state.auctionNum"
        variant="outlined"
       density="compact"
       
        label="Номер аукциона"
        :errorMessages="auctionNumErrorMessages"
        :style="{ maxWidth: '250px' }"
        @change="changeFieldHandler($event, 'auctionNum')"
      />
    </div>
    <v-btn
      v-if="showChangeAgreementBtn"
      color="primary"
      variant="text"
      size="small"
      class="mb-3 ml-5"
      @click="changeAgreementHandler"
    >
      Изменить соглашение
    </v-btn>
  </div>
</template>
<script>
import { BlockTitle } from '@/entities/order'
import { useClientBlock } from './useClientBlock'

export default {
  name: 'ClientBlock',
  components: {
    BlockTitle,
  },
  model: {
    prop: 'item',
    event: 'change',
  },
  props: {
    title: String,
    item: Object,
    routeDate: String,
    agreementDisabled: Boolean,
    orderConfirmed: Boolean,
    carrier: String,
    isValidNum: { type: Boolean, default: true },
    isValidAuctionNum: { type: Boolean, default: true },
  },
  setup(props, ctx) {
    const {
      clientItems,
      agreementNameSring,
      currentAgreement,
      state,
      loading,
      changeClientHandler,
      changeFieldHandler,
      changeAgreementHandler,
      showChangeAgreementBtn,
    } = useClientBlock(props, ctx)
    return {
      clientItems,
      agreementNameSring,
      currentAgreement,
      state,
      loading,
      changeClientHandler,
      changeFieldHandler,
      showChangeAgreementBtn,
      changeAgreementHandler,
    }
  },

  computed: {
    numErrorMessages() {
      return this.isValidNum ? [] : ['Номер заказа клиента не может быть пустым']
    },
    auctionNumErrorMessages() {
      return this.isValidAuctionNum ? [] : ['Номер аукциона не может быть пустым']
    },
  },
}
</script>
<style scoped>
  .client-block {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: baseline;
    margin: 10px;
    gap: 10px;
  }
</style>
