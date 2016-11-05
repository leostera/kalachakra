#!/bin/bash -e

pushd node_modules
  rm -f ./scheduler
  ln -s ../src ./scheduler
popd
