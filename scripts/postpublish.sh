#!/usr/bin/env bash

if [ "$NODE_ENV" = "staging" ]; then
  npm run build-stage
else
  npm run build-production
fi

npm run upload-source-maps