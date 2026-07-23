<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <buttons-panel
          panel-type="list"
          :disabled-refresh="!user || !user.emailConfirmed"
          :disabled-submit="!user || !user.emailConfirmed"
          @refresh="refresh"
          @submit="create"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-list>
          <v-list-subheader>Мои компании</v-list-subheader>
          <v-list-item
            v-for="(item, ind) in myCompanies"
            :key="ind"
            :to="{ name: 'companyDetails', params: { id: item._id } }"
          >
            <v-list-item-title>{{ item.name }}</v-list-item-title>
            <v-list-item-subtitle>
              <small>ИНН: {{ item.inn }}</small>
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ButtonsPanel } from '@/shared/ui'

defineOptions({ name: 'CompanyList' })

const store = useStore()
const router = useRouter()

const myCompanies = computed(() => store.getters.myCompanies)
const user = computed(() => store.getters.user)

function refresh() {
  store.dispatch('getMyCompanies')
}

function create() {
  router.push({ name: 'createNewCompany' })
}
</script>

<style scoped>
.current {
  background-color: rgb(222, 245, 253);
}
</style>
