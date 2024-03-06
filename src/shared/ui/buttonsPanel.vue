<template>
  <v-container fluid class="mb-2">
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
          {{ submitTitle ? submitTitle : 'Сохранить и закрыть' }}
        </v-btn>
      </v-col>
      <v-col v-if="showSaveBtn" cols="auto">
        <v-btn icon @click="$emit('save')" :disabled="disabledSubmit">
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
      </v-col>
      <v-col>
        <slot />
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
      <v-col>
        <slot />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  props: {
    submitTitle: { type: String },
    disabledSubmit: { type: Boolean, default: false },
    disabledRefresh: { type: Boolean, default: false },
    showSaveBtn: { type: Boolean, default: false },
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
