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
        <v-alert
          type="error"
          v-if="itemIsMissing && !loading"
          transition="scale-transition"
        >
          Запись не найдена
        </v-alert>
        <load-spinner v-if="loading" />
        <div v-else>
          <slot />
          <v-btn v-if="displayDeleteBtn" color="error" @click="deleteHandler">
            <v-icon left dark> mdi-delete </v-icon>
            Удалить
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { LoadSpinner } from '@/shared/ui'

export default {
  name: 'EntityFormWrapper',
  components: {
    LoadSpinner,
  },
  props: {
    itemIsMissing: {
      type: Boolean,
      default: false,
    },
    showError: Boolean,
    errorMessage: Boolean,
    loading: {
      type: Boolean,
      default: false,
    },
    displayDeleteBtn: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    async deleteHandler() {
      const res = await this.$confirm(
        'Вы действительно хотите удалить запись? '
      )
      if (res) {
        this.$emit('delete')
      }
    },
  },
}
</script>

<style></style>
