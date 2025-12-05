#!/bin/bash

# Замена устаревших свойств Vuetify

echo "Заменяем устаревшие свойства Vuetify..."

# Заменяем dense на density="compact"
find src -name "*.vue" -type f -exec sed -i 's/dense/density="compact"/g' {} \;

# Заменяем outlined на variant="outlined"
find src -name "*.vue" -type f -exec sed -i 's/ outlined / variant="outlined" /g' {} \;
find src -name "*.vue" -type f -exec sed -i 's/ outlined$/ variant="outlined"/g' {} \;
find src -name "*.vue" -type f -exec sed -i 's/^outlined/variant="outlined"/g' {} \;

# Заменяем hide-details на hideDetails
find src -name "*.vue" -type f -exec sed -i 's/hide-details/hideDetails/g' {} \;

echo "Замена завершена!"