#!/usr/bin/env bash

if [ "$NODE_ENV" = "staging" ]; then
  npm run start-stage
else
  npm run start-production
fi