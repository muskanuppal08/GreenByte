#!/bin/sh

# Change directory to application root
cd /var/www/html

# Cache config, routes, and views for production performance
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run database migrations
echo "Running database migrations..."
php artisan migrate --force

# Start Apache in the foreground
exec apache2-foreground
