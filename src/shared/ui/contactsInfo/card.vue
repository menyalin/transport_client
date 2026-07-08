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
<script setup>
defineModel({ type: Object })

const emit = defineEmits(['edit', 'remove'])

function editHandler() {
  emit('edit')
}

async function removeHandler() {
  const res = confirm('Удалить контакт?')
  if (res) {
    emit('remove')
  }
}
</script>
<style lang=""></style>
