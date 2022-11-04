<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" md="6">
            <v-subheader>
              Что-то пошло не так, скорее всего не доступен сервер или
              отсутствует подключение к интернету
            </v-subheader>
            <v-alert type="error">
              {{ $route.query.message }}
            </v-alert>
            <router-link to="/"> Перейти на главную </router-link>
            <br />
            <small>До автоматического перехода осталось {{ secBefore }}сек</small>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
export default {
  name: 'ErrorPage',
  data() {
    return {
      secBefore: 5,
      interval: null,
    }
  },
  created() {
    this.interval = setInterval(() => {
      this.intervalHandler()
    }, 1000)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    intervalHandler() {
      if (this.secBefore <= 0) {
        clearInterval(this.interval)
        this.$router.push('/')
      } else {
        this.secBefore--
      }
    },
  },
}
</script>
<style></style>
