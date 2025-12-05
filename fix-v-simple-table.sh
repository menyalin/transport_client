#!/bin/bash

# Скрипт для замены v-simple-table на v-table для Vue 3/Vuetify 3 миграции

echo "🔄 Замена v-simple-table на v-table..."

# Находим все .vue файлы с v-simple-table
find src -name "*.vue" -exec grep -l "v-simple-table" {} \; | while read file; do
    echo "Обработка файла: $file"

    # Заменяем открывающие теги
    sed -i 's/<v-simple-table\([^>]*\)>/<v-table\1>/g' "$file"

    # Заменяем закрывающие теги
    sed -i 's/<\/v-simple-table>/<\/v-table>/g' "$file"

    # Заменяем атрибут dense на density="compact"
    sed -i 's/dense>/density="compact">/g' "$file"

    echo "✅ Обработано: $file"
done

echo ""
echo "🎉 Замена v-simple-table на v-table завершена!"
echo ""
echo "📝 Примечание: Возможно потребуется ручная проверка следующих файлов:"
echo "   - Файлы с особыми стилями для v-simple-table"
echo "   - Файлы с условными атрибутами dense"