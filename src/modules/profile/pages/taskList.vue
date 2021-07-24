<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <div v-if="!tasks.length" class="text-center text-h5">
          Активных задач не найдено
        </div>
        <div v-else>
          <v-card v-for="task in tasks" :key="task._id" class="ma-2">
            <v-card-title> {{ task.title }} </v-card-title>
            <v-card-text>
              <pre>{{ task.content }}</pre>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="primary"
                small
                @click="accept(task._id, 'accepted')"
              >
                Принять
              </v-btn>
              <v-btn
                text
                color="error"
                small
                @click="accept(task._id, 'denied')"
              >
                Отказать
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import TaskService from '../services/task.service'

export default {
  name: 'taskList',
  computed: {
    ...mapGetters(['tasks']),
  },
  methods: {
    async accept(id, result) {
      await TaskService.confirmTask(id, result)
    },
  },
}
</script>
<style></style>
