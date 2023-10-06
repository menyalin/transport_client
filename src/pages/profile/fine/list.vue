<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <buttons-panel
          panel-type="list"
          :disabled-refresh="!directoriesProfile"
          :disabledSubmit="!$store.getters.hasPermission('fine:write')"
          @submit="create"
          @refresh="refetch"
        />
        <div class="filter-wrapper">
          <date-range-input v-model="settings.period" />
          <v-select
            v-model="settings.status"
            :items="fineStatuses"
            dense
            hide-details
            outlined
            label="Статус"
            :style="{ maxWidth: '200px' }"
          />
          <v-autocomplete
            v-model="settings.truck"
            label="Грузовик / Прицеп"
            :items="trucks"
            clearable
            auto-select-first
            outlined
            hide-details
            dense
            :style="{ maxWidth: '250px' }"
          />
          <v-autocomplete
            v-model="settings.driver"
            label="Водитель"
            :items="drivers"
            auto-select-first
            clearable
            outlined
            hide-details
            dense
            :style="{ maxWidth: '350px' }"
          />
          <v-select
            v-model.trim="settings.category"
            :items="$store.getters.fineCategories"
            label="Категория"
            outlined
            clearable
            hide-details
            dense
            :style="{ maxWidth: '450px' }"
          />
          <v-checkbox
            v-model="showOnlySelected"
            label="Только отмеченные"
            hide-details
            dense
          />
          <v-checkbox
            v-model="settings.needToWithheld"
            label="Удержать из ЗП водителя"
            hide-details
            dense
          />
          <v-text-field
            v-model.lazy.trim="settings.searchStr"
            label="Поиск"
            outlined
            clearable
            hide-details
            dense
            :style="{ minWidth: '450px', maxWidth: '600px' }"
          />
          <v-autocomplete
            v-model="settings.payingByWorker"
            label="Оплатил"
            :items="workerItems"
            auto-select-first
            clearable
            outlined
            hide-details
            dense
            :loading="workerIsLoading"
            :style="{ maxWidth: '350px' }"
            :filter="() => true"
            :search-input="searchString"
            @update:search-input="handleSearchInputUpdate"
            @change="handleChange"
          />
        </div>
        <v-data-table
          v-model="selected"
          item-key="_id"
          show-select
          :headers="headers"
          :items="preparedList"
          :loading="loading"
          :singleSelect="false"
          dense
          :serverItemsLength="count"
          :footer-props="{
            'items-per-page-options': [50, 100, 200],
          }"
          :options.sync="settings.listOptions"
          @dblclick:row="dblClickRow"
        >
          <template #[`item.isWithheld`]="{ item }">
            <v-icon v-if="item.isWithheld" color="primary">mdi-check</v-icon>
            <v-icon v-else color="primary">mdi-minus</v-icon>
          </template>
          <template #footer.prepend>
            <FineListAnalitics :data="analyticData" />
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { computed } from 'vue'
import { mapGetters } from 'vuex'
import { ButtonsPanel, DateRangeInput } from '@/shared/ui'
import { useItemsForAutocomplete } from '@/entities/worker'
import { FineListAnalitics } from '@/entities/fine'
import { useFineList } from './useList'

export default {
  name: 'FineList',
  components: {
    ButtonsPanel,
    DateRangeInput,
    FineListAnalitics,
  },

  setup(_props, ctx) {
    const {
      fineStatuses,
      settings,
      headers,
      selected,
      showOnlySelected,
      formName,
      loading,
      refetch,
      count,
      analyticData,
      preparedList,
      setInitSettings,
    } = useFineList()

    const {
      items: workers,
      loading: workerIsLoading,
      handleChange,
      handleSearchInputUpdate,
      searchString,
    } = useItemsForAutocomplete({
      ctx,
      propValue: settings.value.payingByWorker,
    })
    const workerItems = computed(() => {
      return [{ value: '__driver__', text: 'ВОДИТЕЛЬ' }, ...workers.value]
    })
    return {
      workerItems,
      workerIsLoading,
      handleChange,
      handleSearchInputUpdate,
      searchString,
      //
      fineStatuses,
      formName,
      settings,
      headers,
      loading,
      refetch,
      count,
      analyticData,
      preparedList,
      selected,
      showOnlySelected,
      setInitSettings,
    }
  },
  computed: {
    ...mapGetters(['directoriesProfile']),
    trucks() {
      return this.$store.getters
        .activeTrucksOnDate()
        .filter((item) => ['truck', 'trailer'].includes(item.type))
        .filter((item) => !item.hideInFines)
        .map((item) => ({ value: item._id, text: item.regNum }))
    },

    drivers() {
      return this.$store.getters
        .activeDriversOnDate()
        .filter((item) => !item.hideInFines)
        .map((item) => ({ value: item._id, text: item.fullName }))
    },
  },
  mounted() {
    if (this.$store.getters.formSettingsMap.has(this.formName)) {
      const storedSettings = this.$store.getters.formSettingsMap.get(
        this.formName
      )
      this.setInitSettings(storedSettings)
    }
  },

  methods: {
    create() {
      this.$router.push({ name: 'FineCreate' })
    },

    dblClickRow(_, { item }) {
      this.$router.push(`fines/${item._id}`)
    },
  },

  beforeRouteLeave(to, from, next) {
    this.$store.commit('setFormSettings', {
      formName: this.formName,
      settings: { ...this.settings },
    })
    next()
  },
}
</script>
<style scoped>
.filter-wrapper {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
  gap: 15px;
}
</style>
