#!/bin/bash

# Скрипт для исправления v-model на props во всем проекте

echo "Исправление v-model на props..."

# Сначала исправим конкретные известные проблемы
echo "Исправление priceWrapper.vue..."
sed -i 's/v-model="items"/:model-value="items" @update:model-value="$emit('\''update:items'\'', \$event)"/g' /home/alexey/transport_client/src/entities/order/priceBlock/priceWrapper.vue

echo "Исправление salaryTariffs/create.vue..."
sed -i 's/v-model="items"/:model-value="items" @update:model-value="$emit('\''update:items'\'', \$event)"/g' /home/alexey/transport_client/src/pages/accounting/salaryTariffs/create.vue

# Теперь обработаем все файлы с .dialog.sync
echo "Исправление .dialog.sync на :dialog и @update:dialog..."
find src -name "*.vue" -exec sed -i 's/:dialog\.sync="\([^"]*\)"/:dialog="\1" @update:dialog="$emit('\''update:dialog'\'', \$event)"/g' {} \;

# Общие шаблоны для v-model на prop
echo "Поиск и исправление других v-model на props..."

# Поиск файлов с потенциальными проблемами
FILES_WITH_VMODEL_PROPS=(
  "src/modules/common/components/zoneAutocomplete/index.vue"
  "src/entities/order/priceBlock/dialogForm.vue"
  "src/entities/order/form/paymentToDriver.vue"
  "src/entities/tariff_contract/form/tariffListWrapper.vue"
  "src/entities/crew/form/transportTable_2/index.vue"
  "src/entities/paymentInvoice/form/paymentInvoiceForm.vue"
  "src/entities/carrier/allowedCarrierAgreements/index.vue"
  "src/shared/ui/entityFiles/index.vue"
  "src/shared/ui/additionalNotifications/index.vue"
  "src/shared/ui/contactsInfo/contactsInfo.vue"
)

for file in "${FILES_WITH_VMODEL_PROPS[@]}"; do
  if [[ -f "$file" ]]; then
    echo "Проверка файла: $file"

    # Показать строки с v-model для ручной проверки
    grep -n "v-model.*dialog" "$file" 2>/dev/null || true
    grep -n "v-model.*items" "$file" 2>/dev/null || true
  fi
done

echo ""
echo "✅ Автоматические исправления завершены!"
echo ""
echo "📋 Файлы которые требуют ручной проверки:"

# Поиск всех потенциальных проблем
find src -name "*.vue" -exec grep -l "v-model=" {} \; | while read file; do
  # Пропускаем уже исправленные файлы
  if [[ ! "$file" =~ (priceWrapper|salaryTariffs) ]]; then
    echo "🔍 $file:"
    grep -n "v-model=" "$file" | head -5
    echo ""
  fi
done

echo ""
echo "🎯 Как проверять и исправлять вручную:"
echo "1. Если v-model используется на prop → заменить на :model-value и @update:model-value"
echo "2. Если v-model используется на data/local state → оставить как есть"
echo "3. Проверить что компонент корректно обрабатывает update:event"