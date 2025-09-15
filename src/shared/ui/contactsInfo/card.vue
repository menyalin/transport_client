<template>
  <v-card>
    <v-card-title>{{ item.name }}</v-card-title>
    <v-card-subtitle>{{ item.position }}</v-card-subtitle>
    <v-card-text>
      <div>тел: {{ item.phone }}</div>
      <div>email: {{ item.email }}</div>
      <div v-if="true" class="note mt-3">
        {{ item.note }}
      </div>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn size="small" color="secondary" @click="editHandler">Редактировать</v-btn>
      <v-btn size="small" color="error" @click="removeHandler">Удалить</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { getCurrentInstance } from 'vue'

export default {
  name: 'ContactCard',
  model: {
    prop: 'item',
    event: 'change',
  },
  props: {
    item: Object,
  },
  setup(_props, ctx) {
    const { proxy } = getCurrentInstance()
    return {
      editHandler: () => {
        ctx.emit('edit')
      },
      removeHandler: async () => {
        const res = await proxy.$dialog.confirm('Удалить контакт?')
        if (res) {
          ctx.emit('remove')
        }
      },
    }
  },
}
</script>
<style lang=""></style>
