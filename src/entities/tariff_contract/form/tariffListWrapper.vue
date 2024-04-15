<template>
  <div class="wrapper ma-2">
    <h5>{{ title }}</h5>
    <v-btn color="primary" @click="addHandler" small>Добавить</v-btn>
    <component
      :is="tariffListComponent"
      :items="itemsWithIdx"
      @deleteByIdx="removeHandler"
      @updateByIdx="updateHandler"
    />
    <v-dialog v-model="dialog" max-width="800" persistent>
      <component
        :is="tariffFormComponent"
        :editableMode="Boolean(item)"
        :initialFormState="item"
        :formTitle="formTitle"
        @cancel="cancelHandler"
        @submit="saveHandler"
        @add="addTariffHandler"
      />
    </v-dialog>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
export default {
  name: 'TariffListWrapper',
  model: {
    prop: 'items',
    event: 'change',
  },
  props: {
    items: { type: Array, default: [] },
    formTitle: String,
    title: String,
    tariffFormComponent: {
      type: [Object, Function],
      required: true,
    },
    tariffListComponent: {
      type: [Object, Function],
      required: true,
    },
  },
  setup(props, ctx) {
    const item = ref(null)
    const items = ref(props.items)
    const dialog = ref(false)
    function addHandler() {
      dialog.value = true
    }
    function cancelHandler() {
      dialog.value = false
      item.value = null
    }
    function saveHandler(val) {
      if (item.value) {
        items.value.splice(item.value.idx, 1, { ...val })
        item.value = null
      } else {
        items.value.push({ ...val })
      }
      ctx.emit('change', items.value)
      dialog.value = false
    }

    const itemsWithIdx = computed(() => {
      return props.items.map((i, idx) => ({ ...i, idx }))
    })

    function addTariffHandler(val) {
      items.value.push({ ...val })
      ctx.emit('change', items.value)
    }

    function updateHandler(idx) {
      item.value = { ...items.value[idx], idx }
      dialog.value = true
    }
    function removeByIdx(idx) {
      items.value.splice(idx, 1)
      ctx.emit('change', items.value)
    }
    return {
      addHandler,
      dialog,
      cancelHandler,
      saveHandler,
      item,
      itemsWithIdx,
      addTariffHandler,
      removeByIdx,
      updateHandler,
    }
  },
  methods: {
    async removeHandler(idx) {
      const res = await this.$confirm(
        'Вы действительно хотите удалить запись? '
      )
      if (res) {
        this.removeByIdx(idx)
      }
    },
  },
}
</script>
<style scoped>
.wrapper {
  display: flex;
  gap: 15px;
  flex-direction: column;
  align-items: flex-start;
}
</style>
