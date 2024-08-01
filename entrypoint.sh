#!/bin/sh

# Wait for the database to be ready
until nc -z db 5432; do
  echo "Waiting for database to be ready..."
  sleep 2
done

# Run database migrations and seeding
npm run prisma:migrate
npm run reset-seed

# Start the application
npm run start