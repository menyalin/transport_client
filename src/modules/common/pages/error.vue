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
            <v-alert type="error">{{ $route.query.message }}</v-alert>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
export default {}
</script>
<style></style>
