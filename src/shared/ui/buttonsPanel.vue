<template>
  <v-container fluid>
    <v-row v-if="panelType === 'form'">
      <v-col cols="auto">
        <v-btn @click="$emit('cancel')"> Отмена </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn
          :disabled="disabledSubmit"
          color="secondary"
          @click="$emit('submit')"
        >
          Сохранить
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-else-if="panelType === 'list'">
      <v-col cols="auto">
        <v-btn :disabled="disabledRefresh" @click="$emit('refresh')">
          Обновить
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn
          :disabled="disabledSubmit"
          color="secondary"
          @click="$emit('submit')"
        >
          Создать
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  props: {
    disabledSubmit: {
      type: Boolean,
      default: false,
    },
    disabledRefresh: {
      type: Boolean,
      default: false,
    },
    panelType: {
      type: String,
      require: true,
      validator: function (value) {
        return ['form', 'list'].indexOf(value) !== -1
      },
    },
  },
}
</script>
<style></style>
