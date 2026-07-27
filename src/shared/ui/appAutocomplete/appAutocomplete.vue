<template>
  <div>
    <v-autocomplete
      v-model="model"
      :label="label"
      :items="items"
      :disabled="disabled"
      :hide-details="hideDetails"
      clearable
      :search="search"
      :append-icon="appendIcon"
      @update:search="search = $event"
      @click:append="appendClick"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

defineOptions({ name: 'AppAutocomplete' })

const model = defineModel<string>({ type: String })

interface Props {
  hideDetails?: boolean
  disabled?: boolean
  label?: string
  itemsGetter?: string
  formName?: string
  createRouteName?: string
  updateRouteName?: string
  fieldName?: string
}

const props = withDefaults(defineProps<Props>(), {
  hideDetails: false,
  disabled: false,
})

const emit = defineEmits<{
  changeSearch: [value: string | null]
}>()

const store = useStore()
const router = useRouter()

const search = ref<string | null>(null)

const items = computed(() => store.getters[props.itemsGetter as string])

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
