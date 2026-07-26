<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <AppUserInfo />
        <AppCompanyInvites v-if="companyInvites.length" class="my-3" :invites="companyInvites" />
        <div v-if="user" class="mt-3">
          <h4>Выбрать профиль компании:</h4>
          <v-select
            class="ma-4"
            :model-value="directoriesProfile"
            :items="companies"
            clearable
            item-title="text"
            item-value="value"
            label="Профиль компании"
            @update:model-value="changeDirectoriesProfile"
            :style="{ 'max-width': '500px' }"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useOrderStore } from '@/entities/order/orderStore'
import AppCompanyInvites from '@/widgets/companyInvites/index.vue'
import AppUserInfo from '@/widgets/userInfo/index.vue'

defineOptions({ name: 'ProfileSettingsPage' })

const store = useStore()
const orderStore = useOrderStore()

const myCompanies = computed(() => store.getters.myCompanies)
const directoriesProfile = computed(() => store.getters.directoriesProfile)
const companyInvites = computed(() => store.getters.companyInvites)
const user = computed(() => store.getters.user)

const companies = computed(() =>
  myCompanies.value.map((item) => ({
    value: item._id,
    text: item.name,
  }))
)

async function changeDirectoriesProfile(val) {
  await store.dispatch('configProfile', { directoriesProfile: val })
  localStorage.clear()
  sessionStorage.clear()
  orderStore.clearDirectories()
  if (val) await store.dispatch('getUserData')
}
</script>

<style></style>
