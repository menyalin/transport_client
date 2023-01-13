<template>
  <div id="wrapper">
    <div id="header">
      <h4>Оценки водителей</h4>
    </div>
    <div id="settings">
      <date-range-input v-model="state.dateRange" />
      <v-btn small color="primary" @click="getLink">
        <v-icon left> mdi-download </v-icon> Скачать отчет
      </v-btn>
    </div>
    <div id="report-body">
      <div id="link-wrapper">
        <v-progress-linear
          v-if="state.loading"
          indeterminate
          color="primary"
          striped
          rounded
        />
        <a v-show="false" ref="linkEl" :href="staticUrl + state.link" download>
          Скачать отчет
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, ref, computed, nextTick } from 'vue'
import { DateRangeInput } from '@/shared/ui'
import initDateRange from './initDateRange.js'
import ReportService from '../../services/index.js'
import store from '@/store'

export default {
  name: 'DriversGradesReport',
  components: {
    DateRangeInput,
  },
  props: {},
  setup() {
    const linkEl = ref(null)
    const state = reactive({
      dateRange: initDateRange(),
      link: null,
      loading: false,
    })

    const staticUrl = computed(() => {
      return process.env.VUE_APP_STATIC_URL + '/'
    })

    async function getLink() {
      try {
        state.loading = true
        state.link = await ReportService.driversGradesGetLink({
          dateRange: state.dateRange,
          company: store.getters.directoriesProfile,
        })
        state.loading = false
        nextTick(() => {
          if (linkEl.value && state.link) linkEl.value.click()
        })
      } catch (e) {
        store.commit('setError', e.message)
      }
    }
    return {
      linkEl,
      state,
      staticUrl,
      getLink,
    }
  },
}
</script>
<style scoped>
#wrapper {
  margin: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

#settings {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin: 0 30px;
  gap: 10px;
}
#report-body {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}
#link-wrapper {
  display: flex;
  margin-top: 50px;
  flex-direction: column;
  min-height: 50px;
  width: 800px;
}
</style>
