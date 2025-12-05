#!/bin/bash

echo "Исправляем дублирующиеся атрибуты..."

# Удаляем дублирующиеся variant атрибуты
find src -name "*.vue" -type f -exec sed -i 's/variant="[^"]*"[[:space:]]*variant="[^"]*"/variant="outlined"/g' {} \;

# Удаляем дублирующиеся density атрибуты
find src -name "*.vue" -type f -exec sed -i 's/density="[^"]*"[[:space:]]*density="[^"]*"/density="compact"/g' {} \;

# Удаляем дублирующиеся color атрибуты
find src -name "*.vue" -type f -exec sed -i 's/color="[^"]*"[[:space:]]*color="[^"]*"/color="primary"/g' {} \;

echo "Исправление завершено!"