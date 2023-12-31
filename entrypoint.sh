#!/bin/bash
set -e

if [ $# -eq 0 ]
  then
    echo "
      No arguments passed
      Usage: bash entrypoint.sh [..]

      Options:
      --wait wait for other services to start (db/redis)
      --generate-prisma-client generate prisma client
      --dev   run dev server
      --prod  run prod server (gunicorn)
    "
    exit 0
fi

while [[ $# -gt 0 ]]
do
key="$1"

echo $1;

case $key in
    --dev)
    DEV=1
    shift
    ;;
    --prod)
    PROD=1
    shift
    ;;
    --seed)
    SEED=1
    shift
    ;;
esac
done

npx prisma generate
npx prisma migrate deploy

if [ -n "${SEED}" ] && [ ! -f /usr/src/app/.seeded ]; then
  echo "Adding seed data"
  npx prisma db seed
  touch /usr/src/app/.seeded
  echo "Seed data added"
fi

if [ -n "${DEV}" ]
then
  echo "development server is running..."
  exec npm run start:dev
fi

if [ -n "${PROD}" ]
then
  echo "production server is running..."
  exec npm run start
fi

