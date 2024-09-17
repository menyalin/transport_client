<template>
  <v-card outlined min-width="800px" max-width="800px" class="ma-3" fill-height>
    <v-card-title> {{ item.title }}</v-card-title>
    <!-- <v-card-subtitle> {{ item.companyName }}</v-card-subtitle> -->
    <v-card-text>
      <div>
        Адреса клиента: <b>{{ addresses }}</b>
      </div>
      <div>
        Основные получатели уведомлений:
        <div class="ma-2">
          <b>{{ item.emails }}</b>
        </div>
      </div>
      <div v-if="!!item.ccEmails">
        Получатели копии уведомлений:
        <div class="ma-2">
          <b>{{ item.ccEmails }}</b>
        </div>
      </div>
      <div>
        Часов до отправки уведомления: <b>{{ item.idleHoursBeforeNotify }}</b>
        используется плановая дата доставки:
        <b> {{ item.usePlannedDate ? 'Да' : 'Нет' }}</b>
      </div>
      <!-- <div v-if="item.useTruckFilter !== 'notUsed'" class="ma-3">
        <v-divider />
        <div>
          {{
            item.useTruckFilter === 'included'
              ? 'Грузовики:'
              : 'Кроме грузовиков:'
          }}
        </div>
        <b>{{ trucks }}</b>
        <v-divider />
      </div> -->
      <div v-if="item.note">
        <i>{{ item.note }}</i>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn small color="secondary" @click="editHandler">Редактировать</v-btn>
      <v-btn small color="error" @click="deleteHandler">Удалить</v-btn>
      <v-spacer />
      <v-btn
        small
        :color="isActive ? 'primary' : null"
        @click="switchStatusHandler"
      >
        {{ isActive ? 'Включено' : 'Выключено' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import store from '@/store/index'
import { computed } from 'vue'
export default {
  name: 'NotificationListItem',
  props: {
    item: Object,
  },
  setup(props, ctx) {
    // const trucks = computed(() => {
    //   return props.item.trucks
    //     ?.map((t) => store.getters.trucksMap.get(t)?.regNum)
    //     .join(', ')
    // })

    const addresses = computed(() => {
      return store.getters.addresses
        .filter((address) => props.item.addresses.includes(address._id))
        .map((i) => i.shortName)
        .join('; ')
    })

    const isActive = computed(() => {
      return props.item.isActive === false ? false : true
    })

    function editHandler() {
      ctx.emit('edit', props.item._id)
    }

    function remove() {
      ctx.emit('delete', props.item._id)
    }

    function switchStatus() {
      ctx.emit('switchStatus', props.item._id)
    }

    return {
      editHandler,
      remove,
      addresses,
      // trucks,
      isActive,
      switchStatus,
    }
  },
  methods: {
    async deleteHandler() {
      const res = await this.$confirm('Уверены?')
      if (res) this.remove()
    },

    async switchStatusHandler() {
      if (this.item.isActive) {
        const res = await this.$confirm(
          'Уверены? Выключение уведомления отменит созданные задачи'
        )
        if (!res) return
      }
      this.switchStatus()
    },
  },
}
</script>
