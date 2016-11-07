#!/bin/bash -e

pushd node_modules
  rm -f ./kalachakra
  ln -s ../src ./kalachakra
popd
