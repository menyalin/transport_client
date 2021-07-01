<template>
  <v-dialog v-model="dialog" max-width="800" persistent>
    <v-card>
      <v-card-title class="text-h5"> Пригласить сотрудника </v-card-title>

      <v-card-text>
        <div>
          <div class="text-subtitle-1">Найдите пользователя по email:</div>
          <v-text-field
            v-model.trim="$v.email.$model"
            @change="changeSearchInput"
            :loading="emailLoading"
            :disabled="emailLoading"
            :error-messages="emailErrors"
          />
        </div>
        <transition name="fade">
          <div v-if="!!user">
            Пользователь:
            <div class="text-h6">{{ user.name }}</div>
            <v-text-field label="Должность" v-model.trim="position" />
            <v-select :items="staffRoles" multiple v-model="roles" chips />
          </div>
        </transition>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="green darken-1" text @click="cancel"> Отмена </v-btn>

        <v-btn color="green darken-1" text @click="save"> Сохранить </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { required, email } from 'vuelidate/lib/validators'
export default {
  name: 'DialoForm',
  data: () => ({
    email: '',
    emailLoading: false,
    user: null,
    position: '',
    roles: [],
  }),
  props: {
    companyId: {
      type: String,
      required: true,
    },
    dialog: {
      type: Boolean,
      default: false,
    },
  },
  validations: {
    email: {
      required,
      email,
    },
  },
  computed: {
    ...mapGetters(['staffRoles']),
    emailErrors() {
      if (this.$v.email.$dirty && this.$v.email.$invalid) {
        return 'Введите корректный email'
      }
      return null
    },
  },
  methods: {
    ...mapActions(['userByEmail', 'addEmployee']),
    cancel() {
      this.closeDialog()
    },
    async save() {
      const newEmployee = {
        user: this.user._id,
        position: this.position,
        roles: this.roles,
      }
      await this.addEmployee({ newEmployee, companyId: this.companyId })
      this.closeDialog()
    },
    closeDialog() {
      this.$emit('close')
    },
    async changeSearchInput(str) {
      if (!this.$v.email.$invalid) {
        this.emailLoading = true
        this.user = await this.userByEmail(str)
        this.emailLoading = false
      }
    },
  },
}
</script>
<style></style>
