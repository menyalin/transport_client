<template>
  <v-container fluid>
    <v-row v-if="panelType === 'form'">
      <v-col cols="auto">
        <v-btn @click="$emit('cancel')">Отмена</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn
          @click="$emit('submit')"
          :disabled="disabledSubmit"
          color="secondary"
        >
          Сохранить
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-else-if="panelType === 'list'">
      <v-col cols="auto">
        <v-btn @click="$emit('refresh')" :disabled="disabledRefresh">
          Обновить
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn
          @click="$emit('submit')"
          :disabled="disabledSubmit"
          color="secondary"
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
