#!/bin/bash

echo "Исправляем оставшиеся проблемы Vuetify 2 -> 3..."

# 1. Заменяем server-items-length на items-length в v-data-table
echo "1. Заменяем server-items-length на items-length..."
find src -name "*.vue" -type f -exec sed -i 's/server-items-length="/items-length="/g' {} \;
find src -name "*.vue" -type f -exec sed -i 's/:serverItemsLength="/:itemsLength="/g' {} \;

# 2. Удаляем устаревшие свойства
echo "2. Удаляем устаревшие свойства..."

# density (остались)
find src -name "*.vue" -type f -exec sed -i 's/ density="[^"]*"//g' {} \;
find src -name "*.vue" -type f -exec sed -i 's/density/density="compact"/g' {} \;

# position-x, position-y, offset-y, nudge-left
find src -name "*.vue" -type f -exec sed -i 's/position-x//g' {} \;
find src -name "*.vue" -type f -exec sed -i 's/position-y//g' {} \;
find src -name "*.vue" -type f -exec sed -i 's/offset-y//g' {} \;
find src -name "*.vue" -type f -exec sed -i 's/nudge-left="/offset="/g' {} \;

# overlap
find src -name "*.vue" -type f -exec sed -i 's/overlap//g' {} \;

# app
find src -name "*.vue" -type f -exec sed -i 's/ app//g' {} \;

# focusable
find src -name "*.vue" -type f -exec sed -i 's/focusable//g' {} \;

# transition
find src -name "*.vue" -type f -exec sed -i 's/transition="[^"]*"//g' {} \;

# 3. Добавляем отсутствующие атрибуты density
echo "3. Добавляем density='compact' где отсутствует..."

# Для v-text-field, v-select, v-autocomplete без density
find src -name "*.vue" -type f -exec grep -l "v-text-field\|v-select\|v-autocomplete" {} \; | while read file; do
    # Добавляем density="compact" после variant="outlined" если нет density
    sed -i '/variant="outlined"/a\ \      density="compact"' "$file"
done

echo "Основные исправления завершены!"