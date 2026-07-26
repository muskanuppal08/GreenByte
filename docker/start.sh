#!/bin/sh

# Change directory to application root
cd /var/www/html

# If using SQLite or DB_CONNECTION is not set, ensure database file exists
if [ "$DB_CONNECTION" = "sqlite" ] || [ -z "$DB_CONNECTION" ]; then
    mkdir -p /var/www/html/database
    if [ ! -f /var/www/html/database/database.sqlite ]; then
        touch /var/www/html/database/database.sqlite
        INIT_SEED=true
    fi
fi

# Cache config, routes, and views for production performance
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run database migrations
echo "Running database migrations..."
php artisan migrate --force

# Seed database if it was just initialized
if [ "$INIT_SEED" = "true" ]; then
    echo "Seeding database..."
    php artisan db:seed --force
fi

# If PORT environment variable is set (e.g. by Railway or Render), configure Apache to listen on it
if [ -n "$PORT" ]; then
    echo "Configuring Apache to listen on port $PORT..."
    sed -i "s/Listen 80/Listen $PORT/g" /etc/apache2/ports.conf
    sed -i "s/<VirtualHost \*:80>/<VirtualHost *:$PORT>/g" /etc/apache2/sites-available/000-default.conf
fi

# Start Apache in the foreground
exec apache2-foreground
