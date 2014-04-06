#!/bin/bash

if [ -z $LIMIT ]; then
  limit=5
else
  limit=$LIMIT
fi

count=0

if [ -t 0 ]; then
  echo 0
  exit 0;
fi

while read -r line; do
  ((count++))
  echo "line = ${line}";
  if [ "$limit" == "$count" ]; then break; fi
done
