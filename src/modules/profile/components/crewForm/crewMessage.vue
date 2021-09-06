<template>
  <div class="field-hint text-caption px-6">
    {{ `${text} ${new Date(visibleDate).toLocaleDateString()}` }}
    <span
      class="link-text"
      @click="goto(crewId)"
    > Перейти </span>
    ,
    <span
      class="link-text"
      :class="{
        'disabled-link': !date || invalid,
      }"
      @click="closeCrew(crewId)"
    >
      Закрыть
    </span>
  </div>
</template>
<script>
import CrewService from '@/modules/profile/services/crew.service'

export default {
  name: 'CrewMessage',
  props: {
    text: {
      type: String,
      required: true,
    },
    visibleDate: {
      // используется для отображения даты
      type: String,
      required: true,
    },
    date: {
      // дата которой будет закрываться смена
      type: String,
    },
    crewId: {
      type: String,
      required: true,
    },
    transportId: {
      type: String,
    },
    invalid: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      required: true,
    },
  },
  methods: {
    async goto(id) {
      const res = await this.$confirm(
        'Вы уверены? информация на странице будет потеряна'
      )
      if (res) this.$router.push({ name: 'CrewDetails', params: { id } })
    },

    async closeCrew(id) {
      if (!id || !this.date || this.invalid) return null
      const res = await CrewService.closeCrew(
        this.transportId ? this.transportId : this.crewId,
        this.date,
        this.type
      )
      if (res) this.$emit('clearCrew')
    },
  },
}
</script>
<style>
.field-hint {
  margin: 0px auto 10px;
}
.link-text {
  color: red;
  font-size: 0.8rem;
  text-decoration: underline;
  cursor: pointer;
}
.disabled-link {
  color: grey;
  cursor: not-allowed;
}
</style>
