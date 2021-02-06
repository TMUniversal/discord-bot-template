#!/bin/bash
echo "[I] | Docker Script"

if [ "$#" == "0" ]
  then
    echo "Pass a parameter."
    exit 1
fi

SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
PKG_VERSION=$("$SCRIPTPATH"/getPkgDetails.js version)
PKG_NAME=$("$SCRIPTPATH"/getPkgDetails.js name)
CLEANUP_COMMAND="docker rmi $PKG_NAME:latest"
DOCKER_BUILD_COMMAND="docker build -t $PKG_NAME:latest ."

if [ -z "$PKG_VERSION" ];
  then
    echo "[E] | Failed to find package version"
    exit 1
  else
    CLEANUP_COMMAND="docker rmi $PKG_NAME:latest $PKG_NAME:$PKG_VERSION"
    DOCKER_BUILD_COMMAND="docker build -t $PKG_NAME:latest -t $PKG_NAME:$PKG_VERSION ."
fi


function runContainer () {
  echo "[I] | Spinning up a container in the background..."
  docker run --rm -d -t --name "$PKG_NAME" "$PKG_NAME"
  echo "[I] | Done."
}

function buildContainer () {
  echo "[I] | Building docker image"
  echo "[I] | Stopping and removing old containers"
  docker stop "$PKG_NAME"
  docker rm "$PKG_NAME"
  echo "[I] | Transpiling TypeScript source..."
  yarn build
  echo "[I] | TS build finished."
  echo "[I] | Cleaning old / overlapping docker images..."
  bash -c "$CLEANUP_COMMAND"
  echo "[I] | Building docker image..."
  bash -c "$DOCKER_BUILD_COMMAND"
  echo "[I] | Docker build finished."
}

if [ "$1" == "build" ]
  then
    buildContainer
elif [ "$1" == "run" ]
  then
    runContainer
elif [ "$1" == "build+run" ]
  then
    buildContainer
    runContainer
elif [ "$1" == "help" ]
  then
    echo "This script is makes dockerizing easier."
    echo "Options:"
    echo "  help:       This help page."
    echo "  build:      Build a container image"
    echo "  run:        Start a docker container with the bot"
    echo "  build+run:  Both of the above scripts"
else
  echo "[E] | Unknown operation. $0 help for help."
fi

echo "[I] | Script finished."