<template>
  <div>
    <div>
      <BlockTitle>{{ title }}</BlockTitle>
    </div>
    <div class="client-block">
      <v-autocomplete
        :items="clientItems"
        v-model="state.client"
        label="Заказчик"
        outlined
        :loading="loading"
        :messages="agreementNameSring"
        :error="!loading && !currentAgreement"
        dense
        @change="changeClientHandler"
        :style="{ maxWidth: '400px' }"
        :disabled="agreementDisabled"
      />

      <v-text-field
        v-model.trim="state.num"
        outlined
        dense
        label="Номер заказа клиента"
        :errorMessages="numErrorMessages"
        :style="{ maxWidth: '250px' }"
        @change="changeFieldHandler($event, 'num')"
      />
      <v-text-field
        v-model.trim="state.auctionNum"
        outlined
        dense
        label="Номер аукциона"
        :errorMessages="auctionNumErrorMessages"
        :style="{ maxWidth: '250px' }"
        @change="changeFieldHandler($event, 'auctionNum')"
      />
    </div>

    <v-btn
      v-if="showChangeAgreementBtn"
      color="primary"
      outlined
      text
      small
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
      return this.isValidNum
        ? []
        : ['Номер заказа клиента не может быть пустым']
    },
    auctionNumErrorMessages() {
      return this.isValidAuctionNum
        ? []
        : ['Номер аукциона не может быть пустым']
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
