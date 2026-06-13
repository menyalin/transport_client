<template>
  <page-layout title="Учет" :nav-items="navButtons">
    <router-view />
  </page-layout>
</template>

<script setup>
import { PageLayout } from '@/shared/ui'

const navButtons = [
  {
    text: 'Соглашения c клиентами',
    icon: 'mdi-file-sign',
    link: '/accounting/agreements',
    onlyWithDirectoriesProfile: true,
    permission: 'agreement:readList',
  },
  {
    text: 'Соглашения c ТК',
    icon: 'mdi-file-sign',
    link: '/accounting/carrierAgreements',
    onlyWithDirectoriesProfile: true,
    permission: 'carrierAgreement:readList',
  },

  {
    text: 'Тарифные контракты',
    icon: 'mdi-file-document-multiple',
    link: '/accounting/tariff_contracts',
    onlyWithDirectoriesProfile: true,
    permission: 'tariffContract:readList',
  },
  {
    text: 'Входящие акты',
    icon: 'mdi-list-box ',
    link: '/accounting/incomingInvoice',
    onlyWithDirectoriesProfile: true,
    permission: 'incomingInvoice:readList',
  },
  {
    text: 'Исходящие акты',
    icon: 'mdi-list-box ',
    link: '/accounting/paymentInvoice',
    onlyWithDirectoriesProfile: true,
    permission: 'paymentInvoice:readList',
  },

  {
    text: 'Описи документов',
    icon: 'mdi-list-box ',
    link: '/accounting/docsRegistry',
    onlyWithDirectoriesProfile: true,
    permission: 'docsRegistry:readList',
  },
  {
    text: 'ЗП Водителей',
    icon: 'mdi-cash ',
    link: '/accounting/driversSalary',
    onlyWithDirectoriesProfile: true,
    permission: 'salaryTariff:readList',
  },
  {
    text: 'Зарплатные тарифы',
    icon: 'mdi-cash ',
    link: '/accounting/salaryTariffs',
    onlyWithDirectoriesProfile: true,
    permission: 'salaryTariff:readList',
  },
]
</script>

<style scoped></style>
