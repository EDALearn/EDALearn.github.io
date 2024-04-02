#!/bin/bash

# List of entries
entries=(
"Domain Event"
"Message Broker"
"Retry"
"Compensating Transaction"
"Correlation Identifier"
"Delivery Guarantee"
)
folder="Concepts"

# Loop over the entries
for i in "${!entries[@]}"; do
  # Create the file path
  # filePath="./EDA${folder}/$(($i+1))-${entries[$i]// /-}.mdx"
  filePath="./EDA${folder}/${entries[$i]// /-}.mdx"

  # Create the file content
  content="---
title: \"${entries[$i]}\"
metaTitle: \"EDA Learn ${folder} - ${entries[$i]}\"
metaDescription: \"EDA Learn ${folder} - ${entries[$i]}\"
---

# ${entries[$i]}
  "
  # Write the content to the file
  echo "- [${entries[$i]}](${filePath})"
  echo "$content" > $filePath
done
