<template>
  <div class="py-3">
    <v-alert 
      v-if="confirmationEmailSended || ($route.query.status === 'need_email_confirmation' && !user.emailConfirmed)" 
      type="info"
    >
      Для завершения регистрации необходимо подтверждение электронного адреса! На <b>{{ user.email }}</b> отправлено письмо с ссылкой
    </v-alert>
    <v-alert
      v-if="$route.query.status === 'email_confirmed' && user.emailConfirmed" 
      type="success"
    >
      Электронная почта подтверждена!
    </v-alert>
    <h3>Настройки профиля пользователя</h3>
    <v-list dense>
      <v-list-item>
        <v-list-item-content>
          Имя: {{ user.name }}
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <div class="list-row">
            <div>
              email: {{ user.email }} 
            </div>
            <v-icon
              class="ml-3" 
              :color="user.emailConfirmed ? 'blue' : 'red'"
            >
              {{ user.emailConfirmed ? 'mdi-check-decagram' : 'mdi-alert-decagram' }}
            </v-icon>
            <v-btn
              v-if="!user.emailConfirmed"
              color="primary" 
              text 
              small
              outlined
              class="ml-3"
              @click="retryConfirmationEmail"
            >
              Отправить письмо повторно
            </v-btn>
          </div>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-btn 
      text 
      outlined
      color="secondary"
      @click="showChangePasswordDialog = true"
    >
      Изменить пароль
    </v-btn>
    <app-change-password-dialog 
      :dialog="showChangePasswordDialog"
      @cancel="cancelHandler"
    />
  </div>
</template>
<script>
import userService from '@/modules/auth/services/user.service'
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
    ...mapGetters(['user'])
  },
  methods: {
    async retryConfirmationEmail() {
      try {
        await userService.retryConfirmationEmail(this.user?.email)
        this.confirmationEmailSended = true
      } catch (e) {
        this.$store.commit('setError', e?.response?.data || e.message)
      }
      
    },

    cancelHandler() {
      this.$nextTick(() => {
        this.showChangePasswordDialog = false
      })
    }

  }

}
</script>
<style scoped>
.list-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
