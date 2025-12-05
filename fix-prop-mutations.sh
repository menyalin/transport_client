#!/bin/bash

echo "Исправляем мутации пропсов в ordersTableSettings.vue..."

file="/home/alexey/transport_client/src/entities/order/ordersTableSettings/ordersTableSettings.vue"

# Заменяем v-model на :modelValue и @update:model-value
sed -i 's/v-model="settings\./:modelValue="settings./g' "$file"

# Добавляем обновление page=1 при изменении полей
sed -i 's/@update:model-value="settings\.listOptions\.page = 1"/@update:model-value="updateSettingsPage"/g' "$file"

# Заменяем v-model без . (для объектов)
sed -i 's/v-model="settings"/:modelValue="settings"/g' "$file"

# Заменяем @change="settings.listOptions.page = 1"
sed -i 's/@change="settings\.listOptions\.page = 1"/@change="updateSettingsPage"/g' "$file"

echo "Исправление завершено для $file"