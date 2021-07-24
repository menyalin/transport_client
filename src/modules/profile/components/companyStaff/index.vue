<template>
  <div>
    <v-subheader>Сотрудники:</v-subheader>
    <div>
      <v-btn
        color="secondary"
        small
        @click="addNewEmployee"
      >
        Пригласить сотрудника
      </v-btn>
    </div>
    <v-card
      v-for="item of staff"
      :key="item._id"
      class="ma-2"
    >
      <v-card-title>
        {{ item.user.name }}
        <span
          v-if="item.user._id === user._id"
          class="text-caption-1"
        >
          (Вы)
        </span>
      </v-card-title>
      <v-card-subtitle>{{ item.user.email }}</v-card-subtitle>
      <v-card-text>
        <div>Должность: {{ item.position }}</div>
        <div class="text-body-1">
          Роли: {{ item.roles.join(', ') }}
        </div>

        <div
          v-if="!item.isActive"
          class="text-h6 pa-3"
        >
          Ожидается подтверждение пользователя
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn
          text
          color="primary"
          small
        >
          Редактировать
        </v-btn>
        <v-btn
          text
          color="error"
          small
        >
          Удалить
        </v-btn>
      </v-card-actions>
    </v-card>
    <app-dialog-form
      :dialog="dialog"
      :company-id="companyId"
      @close="closeDialog"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import AppDialogForm from './dialogForm.vue'

export default {
  name: 'CompanyStaff',
  components: {
    AppDialogForm,
  },
  props: {
    companyId: {
      type: String,
      required: true,
    },
    staff: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
  }),
  computed: {
    ...mapGetters(['user']),
  },
  methods: {
    addNewEmployee() {
      this.dialog = true
    },
    closeDialog() {
      this.dialog = false
    },
  },
}
</script>
<style></style>
