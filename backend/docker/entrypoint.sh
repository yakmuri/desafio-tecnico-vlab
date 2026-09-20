#!/bin/sh
set -e

[ -f vendor/autoload.php ] || composer install --no-interaction
[ -f .env ] || cp .env.example .env
grep -q '^APP_KEY=.\+' .env || php artisan key:generate

php artisan migrate --force

exec php artisan serve --host=0.0.0.0 --port=8000
