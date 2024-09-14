<template>
  <v-menu :disabled="disabled">
    <template #activator="{ props }">
      <v-btn :disabled="disabled" v-bind="props">Скачать</v-btn>
    </template>

    <v-list>
      <v-list-item
        v-for="item in templates"
        :key="item._id"
        @click="itemClickHandler(item._id)"
      >
        <v-list-item-title>{{ item.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'
import { computed } from 'vue'
export default defineComponent({
  name: 'DownloadDocTemplateMenu',
  props: {
    templates: {
      type: Array,
    },
    disabledDownloadFiles: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['downloadTemplate'],
  setup(props, ctx) {
    const disabled = computed(
      () => props.templates?.length === 0 || props.disabledDownloadFiles
    )

    function itemClickHandler(templateId: string) {
      const template = props.templates?.find((i) => i._id === templateId)
      ctx.emit('downloadTemplate', template)
    }

    return { disabled, itemClickHandler }
  },
})
</script>
