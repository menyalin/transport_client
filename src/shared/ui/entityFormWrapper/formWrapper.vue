<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-alert
          type="error"
          dismissible
          v-model="showError"
          transition="scale-transition"
        >
          {{ errorMessage }}
        </v-alert>
        <app-load-spinner v-if="loading" />
        <docs-registry-form
          v-else
          :item="item"
          :displayDeleteBtn="
            !!id && $store.getters.hasPermission('docsRegistry:delete')
          "
          @cancel="cancel"
          @submit="submit"
          @delete="deleteHandler"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {

}
</script>

<style>

</style>