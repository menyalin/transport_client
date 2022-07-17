<template>
  <v-dialog
    v-model="dialog"
    max-width="800"
    persistent
  >
    <v-card>
      <v-card-title class="text-h5">
        Пригласить сотрудника
      </v-card-title>

      <v-card-text>
        <div>
          <div class="text-subtitle-1">
            Найдите пользователя по email:
          </div>
          <v-text-field
            v-model.trim="$v.email.$model"
            сlearable
            :loading="emailLoading"
            :disabled="emailLoading"
            :error-messages="emailErrors"
            @change="changeSearchInput"
          />
        </div>
        <transition name="fade">
          <div v-if="!!user">
            Пользователь:
            <div class="text-h6">
              {{ user.name }}
            </div>
            <v-text-field
              v-model.trim="position"
              label="Должность"
            />
            <v-select
              v-model="roles"
              :items="staffRoles"
              multiple
              chips
            />
          </div>
        </transition>
      </v-card-text>
      <v-card-actions>
        <v-spacer />

        <v-btn
          color="green darken-1"
          text
          @click="cancel"
        >
          Отмена
        </v-btn>

        <v-btn
          color="green darken-1"
          text
          :disabled="isdisableSaveBtn"
          @click="save"
        >
          Пригласить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { required, email } from 'vuelidate/lib/validators'
export default {
  name: 'DialoForm',
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
  data: () => ({
    email: '',
    emailLoading: false,
    user: null,
    position: '',
    roles: [],
  }),
  validations: {
    email: {
      required,
      email,
    },
  },
  computed: {
    ...mapGetters(['staffRoles']),
    emailErrors() {
      if (this.$v.email.$dirty && this.$v.email.$invalid) 
        return 'Введите корректный email'
      return null
    },
    isdisableSaveBtn() {
      return !this.user || !this.position ||  !this.roles.length
    }
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
