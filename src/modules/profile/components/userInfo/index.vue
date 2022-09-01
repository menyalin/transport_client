<template>
  <div class="py-3">
    <h3>Настройки профиля пользователя</h3>
    <v-list dense>
      <v-list-item>
        <v-list-item-content>
          Имя: {{ user.name }}
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          email: {{ user.email }}
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
import { mapGetters } from 'vuex'
import AppChangePasswordDialog from './changePasswordDialog.vue'

export default {
  name: 'UserInfo',
  components: { AppChangePasswordDialog },
  data() {
    return {
      showChangePasswordDialog: false,
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    cancelHandler() {
      this.$nextTick(() => {
        this.showChangePasswordDialog = false
      })
    }

  }

}
</script>
