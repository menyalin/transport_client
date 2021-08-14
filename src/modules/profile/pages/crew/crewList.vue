<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-buttons-panel
          panel-type="list"
          :disabled-refresh="!directoriesProfile"
          @submit="create"
          @refresh="refresh"
        />
        <div class="filters">
          <app-date-time-input
            :value="dateFilter"
            @change="setDateFilter"
          />
          <div>
            <v-select
              :value="tkNameForCrews"
              dense
              outlined
              hide-details
              label="ТК"
              clearable
              :items="tkNames"
              item-value="_id"
              item-text="name"
              @change="setTkNameFilter"
            />
          </div>
        </div>
        <v-list dense>
          <v-list-group
            v-for="truck in crewsByTruck"
            :key="truck._id"
            v-model="truck.active"
            no-action
            :disabled="!truck.nearCrews.length"
          >
            <template v-slot:activator>
              <v-list-item-content
                @dblclick="dblClickRow($event, truck.actualCrew)"
              >
                <div class="group-title-wrapper">
                  <div>
                    {{ truck.regNum }}
                  </div>
                  <div>
                    {{ truck.tkName ? truck.tkName.name : 'Не определено' }}
                  </div>
                  <template v-if="truck.actualCrew">
                    <div>{{ truck.actualCrew.driver.fullName }}</div>
                    <div v-if="truck.actualCrew.trailer">
                      {{ truck.actualCrew.trailer.regNum }}
                    </div>
                  </template>
                </div>
              </v-list-item-content>
              <v-list-item-action v-if="truck.actualCrew">
                <v-icon
                  small
                  @click="createWithCopy(truck.actualCrew)"
                >
                  mdi-note-plus
                </v-icon>
              </v-list-item-action>
            </template>
            <template v-if="truck.nearCrews.length">
              <v-list-item
                v-for="crew of truck.nearCrews"
                :key="crew._id"
                @dblclick="dblClickRow($event, crew)"
                @click.prevent
              >
                <v-list-item-content>
                  <div class="group-title-wrapper">
                    <div>
                      Начало: {{ new Date(crew.startDate).toLocaleString() }}
                    </div>
                    <div>{{ crew.driver.fullName }}</div>
                    <div v-if="crew.trailer">
                      {{ crew.trailer.regNum }}
                    </div>
                  </div>
                </v-list-item-content>
                <v-list-item-action>
                  <v-icon
                    small
                    @click="createWithCopy(crew)"
                  >
                    mdi-note-plus
                  </v-icon>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-list-group>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import AppDateTimeInput from '@/modules/common/components/dateTimeInput'

import { mapGetters } from 'vuex'

export default {
  name: 'CrewList',
  components: {
    AppButtonsPanel,
    AppDateTimeInput,
  },
  data: () => ({
    dateFormat: 'YYYY-MM-DD HH:mm',
  }),
  computed: {
    ...mapGetters([
      'crewsByTruck',
      'directoriesProfile',
      'tkNames',
      'dateForCrews',
      'tkNameForCrews',
    ]),
    dateFilter() {
      if (!this.dateForCrews) return null
      return this.dateForCrews.format(this.dateFormat)
    },
  },
  created() {
    this.$store.dispatch('getCrews', {})
  },
  methods: {
    createWithCopy(crew) {
      this.$router.push({
        name: 'CrewCreate',
        params: {
          tkName: crew.tkName._id,
          truck: crew.truck._id,
          trailer: crew.trailer?._id,
          driver: crew.driver?._id,
        },
      })
    },
    setTkNameFilter(val) {
      this.$store.commit('setTkNameForCrews', val)
    },
    setDateFilter(val) {
      this.$store.commit('setDateForCrews', val)
    },
    create() {
      this.$router.push({ name: 'CrewCreate' })
    },
    refresh() {
      this.$store.dispatch('getCrews', { directiveUpdate: true })
    },
    dblClickRow(_, crew) {
      if (crew) this.$router.push(`crews/${crew._id}`)
    },
  },
}
</script>
<style>
.group-title-wrapper {
  display: flex;
  flex-direction: row;
}
.group-title-wrapper > div {
  padding: 0px 30px;
}
.filters {
  display: flex;
  flex-direction: row;
}
.filters > div {
  padding: 0px 10px;
}
</style>
