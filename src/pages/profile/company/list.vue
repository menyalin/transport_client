<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <buttons-panel
          panel-type="list"
          :disabledRefresh="!user || !user.emailConfirmed"
          :disabledSubmit="!user || !user.emailConfirmed"
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
            lines="two"
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
<script>
import { ButtonsPanel } from '@/shared/ui'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'CompanyList',
  components: {
    ButtonsPanel,
  },
  data() {
    return {
      selectedItem: 0,
    }
  },
  computed: {
    ...mapGetters(['myCompanies', 'user']),
  },
  methods: {
    ...mapActions(['getMyCompanies']),
    refresh() {
      this.getMyCompanies()
    },
    create() {
      this.$router.push({ name: 'createNewCompany' })
    },
  },
}
</script>
<style scoped>
.current {
  background-color: rgb(222, 245, 253);
}
</style>
