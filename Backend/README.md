# Sistema de Votacion - Backend

Backend desarrollado en Laravel 12 (PHP) para el sistema de votacion. Expone una API REST consumida por el frontend en Angular (carpeta `frontend-angular`).

## Requisitos

- PHP 8.2 o superior
- Composer
- XAMPP (o cualquier MySQL/MariaDB standalone)

## Instalacion

1. Instalar XAMPP si no lo tenes: https://www.apachefriends.org/
   Si ya tenes MySQL/MariaDB por otro medio, podes saltear este paso y usar tus propias credenciales en el punto 5.

2. Abrir el Panel de Control de XAMPP e iniciar el modulo **MySQL** (Apache es opcional, solo hace falta si queres usar phpMyAdmin para importar el `.sql` visualmente).

3. Clonar el repositorio y entrar a la carpeta `Backend`:
git clone https://github.com/Emmanuel-Miotti/Evaluaci-n-Solcre.git
cd Backend


4. Instalar dependencias de PHP:
composer install


5. Copiar el archivo de entorno y generar la clave de la aplicacion:
cp .env.example .env
php artisan key:generate


Con XAMPP por defecto, la configuracion de base de datos en `.env` queda:

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=votacion
DB_USERNAME=root
DB_PASSWORD=

   (usuario `root` sin contrasena es el default de XAMPP; si tu instalacion tiene otra, ajustala aca)

6. Crear la base de datos. Dos formas:

   **Opcion A - phpMyAdmin** (con Apache y MySQL corriendo en XAMPP): entrar a `http://localhost/phpmyadmin`, click en "Nueva", nombre `votacion`, crear. Despues ir a la pestana "Importar" de esa base y subir el archivo `database/votacion.sql` (ya trae estructura y datos de prueba cargados).

   **Opcion B - linea de comandos**:
    php artisan migrate --seed

   Esto crea las tablas y precarga los datos de prueba directamente desde las migraciones y el seeder, sin necesitar el `.sql`.

7. Levantar el servidor:

php artisan serve

   La API queda disponible en `http://localhost:8000/api`.

## Datos de prueba

- Administrador: `admin@votacion.test` / `Admin123!`
- 8 votantes de prueba con documentos del `12345678` al `89012345`
- 2 candidatos con documentos `90123456` y `01234567`

## Endpoints principales

Publicos (sin autenticacion):
- `GET /api/candidatos`
- `POST /api/votos` (`documento`, `candidato_id`)
- `POST /api/login` (`email`, `password`)

Protegidos (header `Authorization: Bearer <token>`):
- `POST /api/logout`
- `GET /api/candidatos-mas-votados`
- `GET /api/votos` (listado paginado)
- `GET /api/votos/{id}` (detalle)
- `POST /api/votantes` (agregar votante o candidato)
- `PATCH /api/clave` (cambiar clave del administrador)

## Autenticacion

El login devuelve un token (Laravel Sanctum). Ese token se envia en el header `Authorization: Bearer <token>` en cada request protegido.