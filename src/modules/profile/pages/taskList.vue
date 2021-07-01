<template>
  <v-container>
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
              <v-btn text color="primary" small>Принять</v-btn>
              <v-btn text color="error" small>Отказать</v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'taskList',
  computed: {
    ...mapGetters(['tasks']),
  },
}
</script>
<style></style>
