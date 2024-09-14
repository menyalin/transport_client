<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <div v-if="isLoggedIn && user">
          <div class="ma-5">Пользователь: {{ user.name }} {{ user.email }}</div>
          <v-divider />
          <div class="my-3">
            <router-link to="/profile"> Профиль пользователя </router-link>
          </div>
        </div>
        <div v-else class="text-center text-h3 ma-6">
          Необходима авторизация
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'

export default defineComponent({
  name: 'ProfileLayout',
  computed: {
    ...mapGetters(['isLoggedIn', 'user']),
  },
})
</script>
<style></style>
