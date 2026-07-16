# Sistema de Votacion - Evaluacion Solcre

Solucion fullstack para el ejercicio de votacion: los ciudadanos emiten su voto con su documento, y un administrador puede ver los resultados en tiempo real, listar los votos, agregar votantes y cambiar su clave.

- **Backend**: Laravel 12 + MySQL/MariaDB (carpeta `Backend`)
- **Frontend**: Angular 19 con Angular CLI (carpeta `frontend-angular`)

Cada carpeta tiene su propio README con el paso a paso detallado de instalacion. Resumen rapido:

```
# Backend (con MySQL corriendo, ver seccion de datos de prueba)
cd Backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve          # queda en http://localhost:8000

# Frontend (en otra terminal)
cd frontend-angular
npm install
npm start                  # queda en http://localhost:4200
```

## Datos de prueba

Hay dos formas de cargar la base (elegir una):

**Opcion A - Migraciones y seeder (recomendada)**

Con la base `votacion` creada y las credenciales configuradas en `Backend/.env`:

```
php artisan migrate --seed
```

Esto crea las tablas y precarga los datos de prueba.

**Opcion B - Importar el .sql**

El archivo `Backend/database/votacion.sql` trae la estructura completa y los datos de prueba. Se puede importar desde phpMyAdmin (crear la base `votacion` y usar la pestana Importar) o por linea de comandos.

**Datos que quedan cargados:**

- Administrador: `admin@votacion.test` / `Admin123!`
- 8 votantes regulares con documentos del `12345678` al `89012345`
- 2 candidatos (documentos `90123456` y `01234567`)

## Cambios de la segunda entrega

La primera entrega fue con frontend en React. Para esta segunda pasada, ademas de la revision de calidad que me pidieron, decidi rehacer el frontend en Angular 19 (la opcion sugerida como plus). Lo que revise y cambie:

### Migracion del frontend a Angular 19

- Rehice las 6 pantallas (votacion, login y las 4 vistas del panel) con componentes standalone, signals y formularios reactivos.
- Separacion en capas: `core` (autenticacion, interceptor, guard), `services` (llamadas HTTP), `models` (tipos) y `pages` (pantallas). Los componentes no llaman HTTP directo, siempre pasan por un service.
- El panel de administracion ahora usa rutas hijas (`/admin/resultados`, `/admin/listado`, etc.) protegidas por un guard, en vez de manejar las vistas con estado interno como hacia en React.

### Manejo de sesiones vencidas (no existia en la version React)

- Agregue un interceptor HTTP que suma el token a cada request y, si la API responde 401 (token vencido o invalido), limpia la sesion y redirige al login automaticamente.

### Estados de carga y errores en el frontend

- Skeletons de carga en los listados (ya estaban en React, los mantuve).
- El polling de resultados y del listado ahora se recupera solo ante errores de red: si un refresco falla muestra un aviso y reintenta en el proximo ciclo, en vez de cortarse silenciosamente.
- Los errores de validacion que detecta solo el backend (por ejemplo, documento duplicado al agregar un votante) ahora se muestran con su mensaje especifico en el formulario.

### Estructura del backend

- Movi las validaciones de los controllers a FormRequests (`LoginRequest`, `UpdatePasswordRequest`, `StoreVoterRequest`, `StoreVoteRequest`).
- Extraje la logica de negocio de la emision del voto a un `VoteService` con una excepcion de negocio propia (`ReglaDeNegocioException`), que se transforma a JSON en un unico lugar (`bootstrap/app.php`). El controller de votos quedo solo coordinando.
- Limpie imports sin uso y unifique el formato de las respuestas de error.

### Validaciones consistentes entre frontend y backend

- Las mismas reglas en las dos puntas: documento numerico de 6 a 20 digitos, clave nueva con minimo 8 caracteres, letras, numeros y simbolos, mayoria de edad para votantes, claves nuevas que deben coincidir.
- El frontend valida primero para dar feedback inmediato; el backend valida siempre porque es la unica barrera real.
- Todos los mensajes de error quedaron en espanol, incluido el de documento duplicado.

### Decisiones que tome

- **Un candidato tambien es votante**: esta en el padron y puede emitir su voto (incluso votarse a si mismo, que la consigna no prohibe). El tipo solo define si ademas puede recibir votos.
- **Polling con RxJS (`timer` + `switchMap`)** en vez del `setInterval` que usaba en React: si una respuesta tarda mas que el intervalo se cancela en lugar de acumularse, y el cambio de pagina reinicia el ciclo.
- **El login no detalla que campo fallo** (dice "Email o clave incorrectos"): es a proposito, para no darle pistas a un atacante.
- **Rate limiting**: 5 intentos por minuto en el login y bloqueo de 5 minutos por IP despues de 5 documentos inexistentes seguidos en la votacion, para frenar fuerza bruta y probing del padron.
- Verifique que el build de produccion compila (`npx ng build`).
