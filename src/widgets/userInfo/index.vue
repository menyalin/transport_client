<template>
  <div class="py-3">
    <v-alert
      v-if="
        ($route.query.status === 'need_email_confirmation' && !user.emailConfirmed) ||
        confirmationEmailSended
      "
      type="info"
    >
      Для завершения регистрации необходимо подтверждение электронного адреса! На
      <b>{{ user.email }}</b> отправлено письмо с ссылкой
    </v-alert>
    <v-alert v-if="$route.query.status === 'email_confirmed' && user.emailConfirmed" type="success">
      Электронная почта подтверждена!
    </v-alert>
    <h3>Настройки профиля пользователя</h3>
    <v-list>
      <v-list-item>
        <v-list-item-title> Имя: {{ user.name }} </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <div class="list-row">
          <div>email: {{ user.email }}</div>
          <v-icon class="ml-3" :color="user.emailConfirmed ? 'blue' : 'red'">
            {{ user.emailConfirmed ? 'mdi-check-decagram' : 'mdi-alert-decagram' }}
          </v-icon>
          <v-btn
            v-if="!user.emailConfirmed"
            color="primary"
            size="small"
            class="ml-3"
            @click="retryConfirmationEmail"
          >
            Отправить письмо повторно
          </v-btn>
        </div>
      </v-list-item>
    </v-list>
    <v-btn color="secondary" @click="showChangePasswordDialog = true"> Изменить пароль </v-btn>
    <app-change-password-dialog :dialog="showChangePasswordDialog" @cancel="cancelHandler" />
  </div>
</template>
<script>
import { UserService } from '@/shared/services'
import { mapGetters } from 'vuex'
import AppChangePasswordDialog from './changePasswordDialog.vue'

export default {
  name: 'UserInfo',
  components: { AppChangePasswordDialog },
  data() {
    return {
      confirmationEmailSended: false,
      showChangePasswordDialog: false,
    }
  },
  computed: {
    ...mapGetters(['user']),
  },
  methods: {
    async retryConfirmationEmail() {
      try {
        await UserService.retryConfirmationEmail(this.user?.email)
        this.confirmationEmailSended = true
      } catch (e) {
        this.$store.commit('setError', e?.response?.data || e.message)
      }
    },

    cancelHandler() {
      this.$nextTick(() => {
        this.showChangePasswordDialog = false
      })
    },
  },
}
</script>
<style scoped>
.list-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
