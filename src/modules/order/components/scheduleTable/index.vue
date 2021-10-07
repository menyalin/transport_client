/* eslint-disable vue/no-template-key */
<template>
  <div class="table-wrapper">
    <table border="1">
      <thead>
        <tr>
          <th />
          <th
            v-for="date of columns"
            :key="date"
            class="text-center date-cell"
          >
            {{ date }}
          </th>
        </tr>
      </thead>
      <tbody
        @dragenter.prevent
        @dragover.prevent
      >
        <tr
          v-for="truck of rows"
          :key="truck._id"
          class="truck-row"
        >
          <td>
            <app-truck-title-cell :title="truck.regNum" />
          </td>
          <td
            v-for="date of columns"
            :key="date"
          />
        </tr>
        <div
          class="block"
          draggable
          @dragstart="dragstart"
        />
      </tbody>
    </table>
  </div>
</template>
<script>
import appTruckTitleCell from './truckTitleCell.vue'

export default {
  name: 'ScheduleTable',
  components: {
    appTruckTitleCell,
  },
  props: {
    columns: {
      type: Array,
      required: true,
    },
    rows: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    //
  }),
  computed: {},
  methods: {
    dragstart(e) {
      console.log(e)
    },
  },
}
</script>
<style scoped>
.table-wrapper {
  width: 100%;
  padding: 15px;
}
table {
  --table-border: rgb(154, 154, 154) 1px solid;
  width: 100%;
  border-collapse: collapse;
  border: var(--table-border);
}
td,
th {
  border: var(--table-border);
}
tbody {
  position: relative;
}
.block {
  position: absolute;
  top: 20px;
  left: 40px;
  background-color: indigo;
  width: 70px;
  height: 50px;
}
</style>
