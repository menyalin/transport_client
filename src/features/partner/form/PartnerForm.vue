<template>
  <div class="pb-4">
    <ButtonsPanel
      panel-type="form"
      :disabledSubmit="!store.getters.hasPermission('partner:write') || isInvalidForm"
      @cancel="cancelHandler"
      @submit="submitHandler"
      @save="saveHandler"
      showSaveBtn
      class="mb-3"
    />
    <div v-if="isAdmin">
      <v-text-field v-model.trim="state.invoiceLoader" label="invoiceLoader(admin only)" />
    </div>
    <v-text-field v-model.trim="state.name" :error-messages="nameFieldErrors" label="Название" />

    <v-select
      v-model="state.group"
      label="Группа"
      :items="store.getters.partnerGroups"
      item-title="text"
      clearable
    />
    <v-text-field v-model="state.contacts" clearable label="Контакты" />
    <v-text-field
      v-if="state.isClient"
      v-model="state.cargoDescription"
      clearable
      label="Описание груза"
    />
    <v-checkbox v-model="state.isClient" label="Заказчик" hide-details />
    <v-checkbox v-model="state.isService" label="Сервис" />
    <AllowedAgreements v-model="state.agreements" :agreementItems="clientAgreements" />

    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title>
          <b>Общая информация о компании</b>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <CompanyInfoForm
            :value="state.companyInfo"
            :showTitle="false"
            @change="companyInfoChangedHandler"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-title>
          <b>Банковкие реквизиты</b>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <BankAccountInfoForm
            :showTitle="false"
            :value="state.bankAccountInfo"
            @change="bankAccountInfoChangedHandler"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel v-if="state.isClient && !!item">
        <v-expansion-panel-title>
          <b> Площадки для приема документов</b>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <PlacesForTransferDocs v-model="state.placesForTransferDocs" :partnerId="item._id" />
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel v-if="state.isClient">
        <v-expansion-panel-title>
          <b> Настройка оповещений при простое транспорта</b>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <IdleTruckNotifications
            :partner="item"
            :clientAgreements="clientAgreements"
            @change="emit('changeNotifications', $event)"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <EntityFiles v-if="item && item._id" :itemId="item._id" docType="partner" class="mt-3" />
  </div>
</template>
<script setup>
import {
  ButtonsPanel,
  EntityFiles,
  CompanyInfoForm,
  BankAccountInfoForm,
  AllowedAgreements,
} from '@/shared/ui'
import store from '@/store'
import PlacesForTransferDocs from '@/features/partner/transferDocs/PlacesForTransferDocs.vue'
import IdleTruckNotifications from '@/features/partner/idleNotifications/idleTruckNotifications.vue'
import { usePartnerForm } from './usePartnerForm'

defineOptions({ name: 'PartnerForm' })

const props = defineProps({
  item: {
    type: Object,
  },
  clientAgreements: Array,
})

const emit = defineEmits(['submit', 'save', 'cancel', 'changeNotifications'])

const {
  state,
  isAdmin,
  nameFieldErrors,
  isInvalidForm,
  submitHandler,
  saveHandler,
  cancelHandler,
  bankAccountInfoChangedHandler,
  companyInfoChangedHandler,
} = usePartnerForm(props, { emit })
</script>
