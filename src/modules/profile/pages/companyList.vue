<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-buttons-panel
          panelType="list"
          @refresh="refresh"
          @submit="create"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-list>
          <v-subheader>Мои компании</v-subheader>
          <v-list-item two-line link v-for="item in companies" :key="item._id">
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
import { mapActions, mapState } from 'vuex'

export default {
  name: 'CompanyList',
  components: {
    AppButtonsPanel,
  },
  computed: {
    ...mapState({
      companies: (state) => state.ProfileModule.myCompanies,
    }),
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
