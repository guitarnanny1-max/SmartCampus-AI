#!/bin/bash
FILE_PATH="src/components/Footer.tsx"
SEARCH_STRING="old_text"
REPLACE_STRING="new_text"

if [ ! -f "$FILE_PATH" ]; then
    echo "Error: File '$FILE_PATH' not found."
    exit 1
fi

echo "Updating '$FILE_PATH'..."

if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/$SEARCH_STRING/$REPLACE_STRING/g" "$FILE_PATH"
else
    sed -i "s/$SEARCH_STRING/$REPLACE_STRING/g" "$FILE_PATH"
fi

echo "File update completed successfully!"
