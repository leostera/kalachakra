#!/bin/bash -e

readonly FILES=$(
  find src \
    -name "*.js" \
    -not -name "*.test.js" \
    -not -name "*.perf.js" \
  | sort
)

readonly FILE_COUNT=$(echo "${FILES}" | sed 's/ /\n/g' | wc -l)

echo "== Checking ${FILE_COUNT} file(s)"
TOTAL_PERCENTAGE=0.0
OUTPUT=""
for file in ${FILES}; do
  COVERAGE=$(./node_modules/.bin/flow coverage ${file})
  PERCENTAGE=$(echo "${COVERAGE}" | awk -F': ' '{ print $2}' | awk -F'% ' '{ print $1}') 
  TOTAL_PERCENTAGE="$(echo "${PERCENTAGE} + ${TOTAL_PERCENTAGE}" | bc)"
  OUTPUT="${OUTPUT}${file} - ${COVERAGE}\n"
done

echo -e $OUTPUT | column -t
readonly TOTAL="$( echo "${TOTAL_PERCENTAGE}/${FILE_COUNT}.0" | bc)"
echo "== Coverage: ${TOTAL}%"
