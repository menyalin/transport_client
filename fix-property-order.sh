#!/bin/bash

echo "Исправляем порядок свойств в Vue компонентах..."

# Функция для перемещения beforeRouteLeave/beforeRouteEnter
move_route_hooks() {
    local file="$1"

    # Извлекаем компонент между фигурными скобками
    component=$(awk '/export default {/,/}/' "$file" | sed '1d;$d')

    # Ищем beforeRouteLeave/beforeRouteEnter
    if echo "$component" | grep -q "beforeRouteEnter\|beforeRouteLeave"; then
        # Сохраняем начало компонента до beforeRoute
        start=$(echo "$component" | sed -n '/beforeRouteEnter\|beforeRouteLeave/,$ {p; 46q}' | sed '1d;$d')

        # Сохраняем beforeRoute
        route_hook=$(echo "$component" | sed -n '/beforeRouteEnter\|beforeRouteLeave/,$ {/}/!p; /}/q}' | sed '$d')

        # Сохраняем оставшуюся часть после beforeRoute
        end=$(echo "$component" | sed -n '/}/,$p')

        # Формируем новый порядок
        new_component="$start$route_hook$end"

        # Заменяем в файле
        sed -i "/export default {/,/}/ c\\
export default {\\
${new_component}\\
}" "$file"
    fi
}

# Применяем к файлам с предупреждениями о порядке свойств
files=(
    "src/modules/auth/pages/registration.vue"
    "src/modules/auth/pages/restorePassword.vue"
    "src/pages/accounting/salaryTariffs/list.vue"
    "src/pages/profile/address/list.vue"
    "src/pages/profile/carrier/list.vue"
    "src/pages/profile/city/list.vue"
    "src/pages/profile/crew/crewList.vue"
    "src/pages/profile/downtime/list.vue"
    "src/pages/profile/fine/list.vue"
    "src/pages/profile/scheduleNotes/list.vue"
    "src/pages/profile/truck/truckList.vue"
    "src/pages/profile/zone/list.vue"
    "src/pages/reports/ordersInProgress/index.vue"
    "src/pages/reports/truckStateOnDate/index.vue"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "Обрабатываем: $file"
        move_route_hooks "$file"
    fi
done

echo "Исправление порядка свойств завершено!"