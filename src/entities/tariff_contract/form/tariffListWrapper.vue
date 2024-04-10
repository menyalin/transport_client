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
    items: Array,
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
        ctx.emit('change', [
          ...props.items.slice(0, item.value.idx),
          val,
          ...props.items.slice(item.value.idx + 1),
        ])
        item.value = null
      } else {
        ctx.emit('change', [...props.items, val])
      }
      dialog.value = false
    }
    const itemsWithIdx = computed(() => {
      return [...props.items.map((i, idx) => ({ ...i, idx }))]
    })
    function addTariffHandler(val) {
      ctx.emit('change', [...props.items, val])
    }
    function updateHandler(idx) {
      item.value = { ...props.items[idx], idx }
      dialog.value = true
    }
    function removeByIdx(idx) {
      ctx.emit('change', [
        ...props.items.slice(0, idx),
        ...props.items.slice(idx + 1),
      ])
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
