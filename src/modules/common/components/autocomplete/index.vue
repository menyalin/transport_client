<template>
  <div>
    <v-autocomplete
      v-model="model"
      :label="label"
      :items="items"
      :disabled="disabled"
      :hideDetails="hideDetails"
      clearable
      :search="search"
      :append-icon="appendIcon"
      @update:search="search = $event"
      @click:append="appendClick"
    />
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

defineOptions({ name: 'AppAutocomplete' })

const model = defineModel({ type: String })

const props = defineProps({
  hideDetails: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  label: String,
  itemsGetter: String,
  formName: String,
  createRouteName: String,
  updateRouteName: String,
  fieldName: String,
})

const emit = defineEmits(['changeSearch'])

const store = useStore()
const router = useRouter()

const search = ref(null)

const items = computed(() => store.getters[props.itemsGetter])

const appendIcon = computed(() => {
  if (!props.createRouteName || !props.updateRouteName) return null
  return model.value ? 'mdi-pencil' : 'mdi-plus-circle'
})

watch(search, (val) => {
  emit('changeSearch', val)
})

function appendClick() {
  if (model.value) {
    router.push({
      name: props.updateRouteName,
      params: {
        id: model.value,
        initFormName: props.formName,
        fieldName: props.fieldName,
      },
    })
  } else {
    router.push({
      name: props.createRouteName,
      params: {
        initFormName: props.formName,
        fieldName: props.fieldName,
      },
    })
  }
}
</script>
<style></style>
