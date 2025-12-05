# Vuelidate Migration Guide: Options API → useVuelidate (Composition API)

## Общая схема миграции:

### 1. Импорты:
```javascript
// Старый вариант:
import { required, minLength } from '@vuelidate/validators'

// Новый вариант:
import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import useVuelidate from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'
```

### 2. Структура компонента:
```javascript
// Старый вариант (Options API):
export default {
  data() {
    return {
      form: { name: '', email: '' }
    }
  },
  validations: {
    form: {
      name: { required },
      email: { required, email }
    }
  },
  methods: {
    submit() { /* ... */ }
  }
}

// Новый вариант (Composition API):
export default {
  setup(props, { emit }) {
    const store = useStore()

    const form = reactive({
      name: '',
      email: ''
    })

    const rules = {
      form: {
        name: { required },
        email: { required, email }
      }
    }

    const v$ = useVuelidate(rules, { form })

    const submit = () => {
      emit('submit', form)
    }

    return {
      form,
      v$,
      submit
    }
  }
}
```

### 3. Шаблон:
```vue
<!-- Старый вариант: -->
<v-text-field
  v-model="$v.form.name.$model"
  :error-messages="nameErrors"
  @input="$v.form.name.$touch()"
  @blur="$v.form.name.$touch()"
/>

<!-- Новый вариант: -->
<v-text-field
  v-model="form.name"
  :error-messages="getNameErrors()"
  @input="v$.form.name.$touch()"
  @blur="v$.form.name.$touch()"
/>
```

### 4. Computed свойства для ошибок:
```javascript
// Старый вариант:
computed: {
  nameErrors() {
    const errors = []
    if (!this.$v.form.name.$dirty) return errors
    if (!this.$v.form.name.required) errors.push('Поле обязательно')
    return errors
  }
}

// Новый вариант:
const getNameErrors = () => {
  const errors = []
  if (!v$.value.form.name.$dirty) return errors
  if (!v$.value.form.name.required) errors.push('Поле обязательно')
  return errors
}
```

## Файлы для миграции:
1. src/modules/profile/components/regionForm/index.vue
2. src/modules/profile/components/cityForm/index.vue
3. src/modules/profile/components/zoneForm/index.vue
4. src/modules/auth/pages/registration.vue
5. src/modules/auth/pages/restorePassword.vue
6. src/entities/truck/truckForm.vue
7. src/entities/order/priceBlock/dialogForm.vue
8. src/entities/company/companyForm.vue
9. src/entities/driver/driverForm/index.vue
10. src/shared/ui/additionalNotifications/index.vue
11. src/shared/ui/contactsInfo/contactsInfo.vue

Уже мигрировано:
- ✅ src/entities/worker/form/workerForm.vue
- ✅ src/widgets/userInfo/changePasswordDialog.vue

## Примечания:
- `this.$v` → `v$.value`
- `this.$v.form.name.$model` → `form.name`
- `this.$v.$invalid` → `v$.value.$invalid`
- `this.$v.$reset()` → `v$.value.$reset()`
- `this.$v.form.name.$touch()` → `v$.value.form.name.$touch()`
- `this.$v.form.name.$dirty` → `v$.value.form.name.$dirty`
- `this.$v.form.name.$invalid` → `v$.value.form.name.$invalid`