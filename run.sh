#!/bin/bash
set -o allexport
source .env 
set +o allexport
node ./.output/server/index.mjs
