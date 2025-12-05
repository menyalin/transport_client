#!/bin/bash

echo "Исправляем дублирующиеся density атрибуты..."

# Ищем файлы с проблемами дублирования density
grep -r 'density="[^"]*".*density=' src/ --include="*.vue" -l | while read file; do
    echo "Исправляем файл: $file"

    # Исправляем pattern: density="compact" density="something" -> density="compact"
    sed -i -E 's/density="([^"]*)"([^>]*)density="[^"]*"/density="\1"\2/g' "$file"

    # Исправляем pattern: density density="compact" -> density="compact"
    sed -i 's/density density="[^"]*"/density="compact"/g' "$file"

    # Исправляем pattern: =dense="compact" -> density="compact"
    sed -i 's/=density="[^"]*"/ density="compact"/g' "$file"
done

echo "Исправление завершено!"