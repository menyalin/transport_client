<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" md="6">
            <v-alert type="error">
              Доступ к запрашиваемой странице запрещен
            </v-alert>
            <router-link :to="$route.query.redirect">
              {{
                $route.query.redirect !== '/'
                  ? 'Вернуться назад'
                  : 'Перейти на главную страницу'
              }}
            </router-link>
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
  name: 'AccessDenied',
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
        this.$router.push(this.$route.query.redirect)
      } else {
        this.secBefore--
      }
    },
  },
}
</script>
<style></style>
