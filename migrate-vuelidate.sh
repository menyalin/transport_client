#!/bin/bash

# Скрипт для быстрой миграции Vuelidate с Options API на useVuelidate (Composition API)

echo "Миграция Vuelidate шаблонов..."

# Список файлов для миграции
FILES=(
  "src/modules/profile/components/regionForm/index.vue"
  "src/modules/profile/components/cityForm/index.vue"
  "src/modules/profile/components/zoneForm/index.vue"
  "src/modules/auth/pages/restorePassword.vue"
  "src/entities/truck/truckForm.vue"
  "src/entities/order/priceBlock/dialogForm.vue"
  "src/entities/company/companyForm.vue"
  "src/entities/driver/driverForm/index.vue"
)

# Основные замены в шаблонах
for file in "${FILES[@]}"; do
  if [[ -f "$file" ]]; then
    echo "Обработка файла: $file"

    # Замена v-model
    sed -i 's/v-model="\$v\.\([^.]*\)\.\$model"/v-model="\1"/g' "$file"
    sed -i 's/v-model\.trim="\$v\.\([^.]*\)\.\$model"/v-model.trim="\1"/g' "$file"

    # Замена $v.$invalid
    sed -i 's/\$v\.\$invalid/v$.$invalid/g' "$file"

    # Замена error-messages с computed на методы
    sed -i 's/:error-messages="\([a-zA-Z]*\)Errors"/:error-messages="get\1Errors()"/g' "$file"

    # Замена $touch вызовов
    sed -i 's/@input="\$v\.\([^.]*\)\.\$touch()"/@input="v$.\1.$touch()"/g' "$file"
    sed -i 's/@blur="\$v\.\([^.]*\)\.\$touch()"/@blur="v$.\1.$touch()"/g' "$file"

    echo "✅ Шаблон обновлен: $file"
  else
    echo "❌ Файл не найден: $file"
  fi
done

echo "🎉 Миграция шаблонов завершена!"
echo ""
echo "Дальнейшие шаги:"
echo "1. Обновить скрипт часть каждого компонента на Composition API"
echo "2. Использовать VUELIDATE_MIGRATION_GUIDE.md как руководство"
echo "3. Проверить работу каждого компонента"