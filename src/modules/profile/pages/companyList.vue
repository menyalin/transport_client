<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-buttons-panel
          panel-type="list"
          @refresh="refresh"
          @submit="create"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-list>
          <v-subheader>Мои компании</v-subheader>
          <v-list-item
            v-for="item in myCompanies"
            :key="item._id"
            two-line
            :to="{ name: 'companyDetails', params: { id: item._id } }"
          >
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle>
                <small>ИНН: {{ item.inn }}</small>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'CompanyList',
  components: {
    AppButtonsPanel,
  },
  computed: {
    ...mapGetters(['myCompanies']),
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
<style></style>
