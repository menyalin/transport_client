<template>
  <v-menu offset-y :close-on-content-click="false">
    <template #activator="{ on, attrs }">
      <v-btn color="primary" dark v-bind="attrs" icon v-on="on">
        <v-icon small> mdi-cog </v-icon>
      </v-btn>
    </template>
    <v-list class="px-2">
      <v-switch
        v-for="field of allHeaders"
        :key="field.value"
        :label="field.hiddenTitle || field.text"
        v-model="activeFields"
        :value="field.value"
        dense
        hide-details
      />
    </v-list>
  </v-menu>
</template>
<script>
import { ref, watch } from 'vue'

export default {
  name: 'TableColumnSetting',
  props: {
    allHeaders: {
      type: Array,
      required: true,
    },
    listSettingsName: {
      type: String,
      required: true,
    },
  },

  setup(props, ctx) {
    if (!props.listSettingsName) throw new Error('listSettingName is missing')
    const activeFields = ref([])
    const savedFields = JSON.parse(localStorage.getItem(props.listSettingsName))

    function getHeaders() {
      if (activeFields.value.length === 0)
        return props.allHeaders.filter((i) => i.default)
      else
        return props.allHeaders.filter((i) =>
          activeFields.value.includes(i.value)
        )
    }

    function inputHandler(field) {
      if (!activeFields.value.includes(field)) activeFields.value.push(field)
      else activeFields.value = activeFields.value.filter((i) => i !== field)
    }

    function emitHeaders() {
      ctx.emit('change', getHeaders())
    }

    if (savedFields && savedFields.length) activeFields.value = savedFields
    else
      activeFields.value = props.allHeaders
        .filter((i) => i.default)
        .map((i) => i.value)

    watch(
      activeFields,
      () => {
        localStorage.setItem(
          props.listSettingsName,
          JSON.stringify(activeFields.value)
        )
        emitHeaders()
      },
      { deep: true, immediate: true }
    )

    return {
      activeFields,
      inputHandler,
    }
  },
}
</script>
<style></style>
