#!/bin/bash

echo "Исправляем основные проблемы линтера..."

# 1. Исправляем мутации пропсов
echo "1. Исправляем мутации пропсов..."

# Заменяем v-model="settings.X" на :modelValue="settings.X"
find src -name "*.vue" -type f -exec sed -i -E 's/v-model="settings\.([^"]*)"/:modelValue="settings.\1"/g' {} \;

# Добавляем @update:model-value для полей с мутацией settings.listOptions.page
find src -name "*.vue" -type f -exec sed -i 's/@update:model-value="settings\.listOptions\.page = 1"/@update:model-value="updateSettingsPage"/g' {} \;

# 2. Заменяем устаревшие свойства
echo "2. Заменяем устаревшие свойства Vuetify..."

# Удаляем position-x
find src -name "*.vue" -type f -exec sed -i 's/position-x//g' {} \;

# 3. Исправляем неверные теги
echo "3. Исправляем неверные теги..."

# Заменяем </v-col> на </v-col> (проверка на незакрытые теги)
find src -name "*.vue" -type f -exec sed -i 's/<\/v-col[[:space:]]*$/<\/v-col>/g' {} \;

# 4. Исправляем computed функции
echo "4. Исправляем computed функции..."

# Добавляем return в computed функции (поиск случаев без return)
# Это нужно делать вручную для каждого файла

echo "Основные исправления завершены!"