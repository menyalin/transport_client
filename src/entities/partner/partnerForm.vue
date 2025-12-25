<template>
  <div class="pb-4">
    <buttons-panel
      panel-type="form"
      :disabledSubmit="
        !$store.getters.hasPermission('partner:write') || isInvalidForm
      "
      @cancel="cancelHandler"
      @submit="submitHandler"
      @save="saveHandler"
      showSaveBtn
      class="mb-3"
    />
    <div v-if="isAdmin">
      <v-text-field
        v-model.trim="state.invoiceLoader"
        label="invoiceLoader(admin only)"
        outlined
        dense
      />
    </div>
    <v-text-field
      v-model.trim="state.name"
      :error-messages="nameFieldErrors"
      outlined
      label="Название"
      dense
    />
    <!-- <v-text-field
      v-model.trim="state.fullName"
      outlined
      label="Полное наименование"
      dense
    />
    <v-text-field
      v-model.trim="state.inn"
      outlined
      label="ИНН"
      dense
    /> -->
    <v-select
      v-model="state.group"
      label="Группа"
      :items="$store.getters.partnerGroups"
      outlined
      dense
      clearable
    />
    <v-text-field
      v-model="state.contacts"
      outlined
      clearable
      label="Контакты"
      dense
    />
    <v-text-field
      v-if="state.isClient"
      v-model="state.cargoDescription"
      outlined
      clearable
      label="Описание груза"
      dense
    />
    <v-checkbox v-model="state.isClient" label="Заказчик" hide-details dense />
    <v-checkbox v-model="state.isService" label="Сервис" dense />
    <AllowedAgreements
      v-model="state.agreements"
      :agreementItems="clientAgreements"
    />

    <v-expansion-panels focusable>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <b>Общая информация о компании</b>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <CompanyInfoForm
            :value="state.companyInfo"
            :showTitle="false"
            @change="companyInfoChangedHandler"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <b>Банковкие реквизиты</b>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <BankAccountInfoForm
            :showTitle="false"
            :value="state.bankAccountInfo"
            @change="bankAccountInfoChangedHandler"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-if="state.isClient && !!item">
        <v-expansion-panel-header>
          <b> Площадки для приема документов</b>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <places-for-transfer-docs
            v-model="state.placesForTransferDocs"
            :partnerId="item._id"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-if="state.isClient">
        <v-expansion-panel-header>
          <b> Настройка оповещений при простое транспорта</b>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <IdleTruckNotifications
            :partner="item"
            :clientAgreements="clientAgreements"
            @change="changeNotificationsHandler"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <EntityFiles v-if="item && item._id" :itemId="item._id" docType="partner" />
  </div>
</template>
<script>
import {
  ButtonsPanel,
  EntityFiles,
  CompanyInfoForm,
  BankAccountInfoForm,
  AllowedAgreements,
} from '@/shared/ui'
import PlacesForTransferDocs from './placesForTransferDocs.vue'
import IdleTruckNotifications from './idleTruckNotifications/idleTruckNotifications'
import { usePartnerForm } from './usePartnerForm'

export default {
  name: 'PartnerForm',
  components: {
    ButtonsPanel,
    PlacesForTransferDocs,
    EntityFiles,
    CompanyInfoForm,
    IdleTruckNotifications,
    BankAccountInfoForm,
    AllowedAgreements,
  },
  props: {
    item: {
      type: Object,
    },
    clientAgreements: Array,
  },
  setup(props, ctx) {
    const changeNotificationsHandler = (items) => {
      ctx.emit('changeNotifications', items)
    }

    const {
      state,
      v$,
      isAdmin,
      nameFieldErrors,
      isInvalidForm,
      submitHandler,
      saveHandler,
      cancelHandler,
      bankAccountInfoChangedHandler,
      companyInfoChangedHandler,
    } = usePartnerForm(props, ctx)
    return {
      state,
      v$,
      isAdmin,
      nameFieldErrors,
      isInvalidForm,
      submitHandler,
      saveHandler,
      cancelHandler,
      changeNotificationsHandler,
      bankAccountInfoChangedHandler,
      companyInfoChangedHandler,
    }
  },
}
</script>
