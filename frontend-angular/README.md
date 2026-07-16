# Sistema de Votacion - Frontend

Frontend en Angular 19 (Angular CLI) para el sistema de votacion. Consume la API del backend en Laravel.

> Esta version en Angular reemplaza a la primera entrega hecha en React. El detalle de los cambios esta en la nota de entrega del repositorio.

## Requisitos

- Node.js 20.11 o superior (tambien sirve 18.19+ o 22+)
- npm

## Instalacion

1. Clonar el repositorio y entrar a la carpeta `frontend-angular`:

```
git clone https://github.com/Emmanuel-Miotti/Evaluacion-Solcre.git
cd Evaluacion-Solcre/frontend-angular
```

2. Instalar dependencias:

```
npm install
```

3. Verificar que el backend este corriendo en `http://localhost:8000` (ver README del Backend). La URL base de la API esta en `src/environments/environment.ts`; si el backend corre en otro puerto, ajustar `apiUrl` ahi.

4. Levantar el servidor de desarrollo:

```
npm start
```

La aplicacion queda disponible en `http://localhost:4200`.

## Pantallas

- `/` - Pantalla de votacion: ingreso de documento y seleccion de candidato.
- `/login` - Login del administrador.
- `/admin` - Panel de administracion (requiere login), con sub-rutas:
  - `/admin/resultados` - Candidatos mas votados, con actualizacion automatica cada 5 segundos.
  - `/admin/listado` - Listado paginado de votos con detalle de cada voto, actualizacion automatica cada 1 segundo.
  - `/admin/agregar` - Alta de votantes o candidatos.
  - `/admin/clave` - Cambio de clave del administrador.

## Datos de prueba

- Administrador: `admin@votacion.test` / `Admin123!`
- Documentos de votantes de prueba: del `12345678` al `89012345` (ver README del Backend).

## Estructura

```
src/app/
  core/       Autenticacion: AuthService, interceptor HTTP (token + manejo de 401) y guard de rutas
  models/     Interfaces TypeScript de las respuestas de la API
  services/   Servicios que encapsulan las llamadas HTTP (candidatos, votos, votantes, admin)
  pages/      Componentes de pantalla (votacion, login, panel admin y sus vistas)
```

## Notas

- El token de sesion se guarda en `localStorage` bajo la clave `admin_token`.
- Si la sesion vence (la API responde 401), el interceptor limpia el token y redirige automaticamente a `/login`.
- Los listados usan skeletons de carga y el polling se recupera solo ante errores de red.
- Para verificar el build de produccion: `npx ng build` (genera `dist/`).
