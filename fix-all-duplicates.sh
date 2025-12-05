#!/bin/bash

echo "Исправляем все дублирующиеся атрибуты..."

# Исправляем дублирующиеся variant
find src -name "*.vue" -type f -exec sed -i -E 's/variant="[^"]*"[[:space:]]+variant="[^"]*"/variant="outlined"/g' {} \;

# Исправляем дублирующиеся color
find src -name "*.vue" -type f -exec sed -i -E 's/color="[^"]*"[[:space:]]+color="[^"]*"/color="primary"/g' {} \;

# Исправляем дублирующиеся density
find src -name "*.vue" -type f -exec sed -i -E 's/density="[^"]*"[[:space:]]+density="[^"]*"/density="compact"/g' {} \;

# Исправляем дублирующиеся hideDetails
find src -name "*.vue" -type f -exec sed -i 's/hideDetails[[:space:]]*hideDetails/hideDetails/g' {} \;

# Исправляем дублирующиеся size
find src -name "*.vue" -type f -exec sed -i -E 's/size="[^"]*"[[:space:]]+size="[^"]*"/size="small"/g' {} \;

echo "Исправление завершено!"