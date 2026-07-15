# Sistema de Votacion - Frontend

Frontend en React + TypeScript (Vite) para el sistema de votacion. Consume la API del backend en Laravel.

## Requisitos

- Node.js 20 o superior
- npm

## Instalacion

1. Clonar el repositorio y entrar a la carpeta `Frontend`:
git clone https://github.com/Emmanuel-Miotti/Evaluaci-n-Solcre.git
cd Frontend

2. Instalar dependencias:
npm install

3. Verificar que el backend este corriendo en `http://localhost:8000` (ver README del Backend). La URL base de la API esta en `src/api/client.ts`; si el backend corre en otro puerto, ajustar `baseURL` ahi.

4. Levantar el servidor de desarrollo:
npm run dev
   La aplicacion queda disponible en `http://localhost:5173` (o el puerto que indique la consola).

## Pantallas

- `/` - Pantalla de votacion: ingreso de documento y seleccion de candidato.
- `/login` - Login del administrador.
- `/admin` - Panel de administracion (requiere login): candidatos mas votados, listado de votos con detalle, agregar nuevo votante, modificar clave del administrador.

## Notas

- El token de sesion del administrador se guarda en `localStorage` bajo la clave `admin_token`.
- El acceso a `/admin` redirige automaticamente a `/login` si no hay un token guardado.