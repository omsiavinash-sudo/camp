#!/bin/bash
# Script to rebuild and restart the backend container

echo "Rebuilding backend container..."
docker-compose build backend

echo "Restarting backend container..."
docker-compose up -d backend

echo "Checking backend logs..."
docker logs mycamp-backend --tail 20

echo "Done! Backend has been restarted."
