#!/bin/bash

# Define variables
CSV_FILE="revisions.csv"
DOC_NAME="energy-market"
DOC_NAME_UKR="Правила ринку електроенергії"

# Read CSV file line by line
while IFS=, read -r url date1 date2 date3; do
    # Download URL with wget and set creation date
    filename="$DOC_NAME.html"
    wget -O $filename $url
    creation_date=$(date -d "$date1" "+%d.%m.%Y")
    touch -t $date3 "$filename"

    pandoc -f html -t gfm "$filename" -o "$DOC_NAME.md"

    # Commit changes to Git
    git add "$filename"
    git add "$DOC_NAME.md"

    git commit -m "Додали зміни у $DOC_NAME_UKR від $date1"
done < $CSV_FILE