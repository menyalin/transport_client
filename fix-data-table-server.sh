#!/bin/bash

# Замена v-data-table на v-data-table-server и обновление атрибутов

echo "Заменяем v-data-table на v-data-table-server..."

# Находим файлы с server-items-length
files=$(grep -l "server-items-length" src/**/*.vue)

for file in $files; do
    echo "Обрабатываем файл: $file"

    # Заменяем v-data-table на v-data-table-server
    sed -i 's/v-data-table/v-data-table-server/g' "$file"

    # Заменяем server-items-length на items-length
    sed -i 's/server-items-length/items-length/g' "$file"
done

echo "Замена завершена!"