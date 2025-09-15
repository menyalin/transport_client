<template>
  <div class="pb-4">
    <buttons-panel
      panel-type="form"
      :disabledSubmit="
        !$store.getters.hasPermission('partner:write') || isInvalidForm
      "
      showSaveBtn
      class="mb-3"
      @cancel="cancelHandler"
      @submit="submitHandler"
      @save="saveHandler"
    />
    <div v-if="isAdmin">
      <v-text-field
        v-model.trim="state.invoiceLoader"
        label="invoiceLoader(admin only)"
        variant="outlined"
        density="compact"
      />
    </div>
    <v-text-field
      v-model.trim="state.name"
      :error-messages="nameFieldErrors"
      variant="outlined"
      label="Название"
      density="compact"
    />
    <!-- <v-text-field
      v-model.trim="state.fullName"
      variant="outlined"
      label="Полное наименование"
      density="compact"
    />
    <v-text-field
      v-model.trim="state.inn"
      variant="outlined"
      label="ИНН"
      density="compact"
    /> -->
    <v-select
      v-model="state.group"
      label="Группа"
      :items="$store.getters.partnerGroups"
      variant="outlined"
      density="compact"
      clearable
    />
    <v-text-field
      v-model="state.contacts"
      variant="outlined"
      clearable
      label="Контакты"
      density="compact"
    />
    <v-text-field
      v-if="state.isClient"
      v-model="state.cargoDescription"
      variant="outlined"
      clearable
      label="Описание груза"
      density="compact"
    />
    <v-checkbox
      v-model="state.isClient"
      label="Заказчик"
      hide-details
      density="compact"
    />
    <v-checkbox v-model="state.isService" label="Сервис" density="compact" />

    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title>
          <b>Общая информация о компании</b>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <CompanyInfoForm
            :value="state.companyInfo"
            :showTitle="false"
            @update:model-value="companyInfoChangedHandler"
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
            @update:model-value="bankAccountInfoChangedHandler"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel v-if="state.isClient && !!item">
        <v-expansion-panel-title>
          <b> Площадки для приема документов</b>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <places-for-transfer-docs
            v-model="state.placesForTransferDocs"
            :partnerId="item._id"
          />
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
            @update:model-value="changeNotificationsHandler"
          />
        </v-expansion-panel-text>
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
