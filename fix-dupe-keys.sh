#!/bin/bash

echo "Исправляем дублирующиеся ключи..."

# Заменяем headers: tableHeaders на просто tableHeaders
find src -name "*.vue" -type f -exec sed -i 's/headers: tableHeaders/tableHeaders/g' {} \;

# Исправляем allHeaders: props.allHeaders на allHeaders: props.allHeaders
find src -name "*.vue" -type f -exec sed -i 's/allHeaders: props.allHeaders/allHeaders: props.allHeaders/g' {} \;

echo "Исправление завершено!"