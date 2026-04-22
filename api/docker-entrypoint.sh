#!/bin/sh
set -e

# Wait for DB to be ready
# Using nc (netcat) to check for port availability
echo "Checking database connection on $DB_HOST:$DB_PORT..."
while ! nc -z $DB_HOST $DB_PORT; do
  echo "Waiting for database ($DB_HOST:$DB_PORT) to be ready..."
  sleep 2
done
echo "Database is up and running!"

# Run migrations if enabled
if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "🚀 Running database migrations..."
  npm run migrate
fi

# Run seeds if enabled
if [ "$RUN_SEEDS" = "true" ]; then
  echo "🌱 Seeding data..."
  npm run seed
fi

# Start the actual application
echo "🎬 Starting application..."
exec "$@"
