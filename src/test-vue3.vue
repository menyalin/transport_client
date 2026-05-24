<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import { DateTimeInput, DateRangeInput } from '@/shared/ui/DateInputs'

const date = ref(new Date().toISOString())
const dateRange = ref([dayjs().toISOString(), dayjs('2026-05-18').toISOString()])
</script>

<template>
  <v-container class="fill-height" fluid>
    <v-row class="align-center justify-center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-4">
          <v-card-text>
            <h3>DateTimeInput</h3>
            <DateTimeInput
              label="Форма ввода даты"
              v-model="date"
              type="datetime-local"
              showPrependIcon
            />
            <h4>value: {{ date }}</h4>

            <v-divider />
            <h3>DateRageInput</h3>
            <h4>value: {{ dateRange }}</h4>
            <v-divider />
            <DateRangeInput v-model="dateRange" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
