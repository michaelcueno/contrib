#!/bin/bash 
#
# Start up dependencies and the API server
#
# Start Mongo db 
if [ -z "$(docker ps --filter name=mongo -aq)" ]; then
  echo "Launching mongo container."
  docker run -p 27017:27017 --name mongo mongo:latest
elif [ -n "$(docker ps --filter name=mongo --filter status=exited -aq)" ]; then
  echo "Relaunching mongo container."
  docker start mongo 
fi


# Verify that mongo started up 
VERIFY_MONGO_CMD='curl localhost:27017'
printf "Verifying $service_name server"
set +e
eval $VERIFY_MONGO_CMD
while [ -$? -ne 0 ]; do
  printf "."
  sleep 1
  eval $VERIFY_MONGO_CMD;
done
echo
set -e
echo "Mongo is ready"

echo "starting API server"

NODE_ENV=dev yarn nodemon 
