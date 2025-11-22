#!/bin/bash

# Fix admin component imports from named to default exports

echo "🔧 Fixing admin component imports..."

# List of components to fix
components=(
  "StatusBadge"
  "SearchBar"
  "FilterDropdown"
  "DataTable"
  "ActionMenu"
  "ConfirmDialog"
  "Pagination"
  "BulkActions"
  "FormField"
)

# Find all admin pages
files=$(find apps/web/src/app/\(admin\)/admin -name "*.tsx" -type f)

for file in $files; do
  echo "Processing: $file"
  
  for component in "${components[@]}"; do
    # Replace named import with default import
    sed -i '' "s/import { ${component} } from '@\/components\/admin\/${component}'/import ${component} from '@\/components\/admin\/${component}'/g" "$file"
  done
done

echo "✅ Done! Fixed all admin component imports."

