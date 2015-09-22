#!/bin/bash

PROJECT_YOUR_PATH="."
TMUX="tmux"

$TMUX new \; \
  split-window -h \; \
  split-window -v \; \
  select-pane -t 0 \; \
    send-keys "nodemon src/index.js" Enter \; \
  select-pane -t 1 \; \
    send-keys "gulp" Enter \; \
  select-pane -t 2 \; \
    send-keys "./mongodb/mongod --dbpath __database/givemetask --port 27340" Enter \; \
