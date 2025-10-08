# 🚀 ShipShop – Ecommerce de Cohetes

Proyecto full-stack desarrollado como práctica universitaria.  
Consiste en una aplicación de comercio electrónico para la venta de cohetes, con **React** en el frontend, **Node.js/Express** en el backend y **MySQL** como base de datos.

Incluye autenticación con JWT, carrito de compras, gestión de productos y calificación de productos por usuarios.

---

## 🛠️ Requisitos previos

- **Node.js** ≥ 18
- **npm** ≥ 9 (o yarn/pnpm si prefieres)
- **MySQL** ≥ 8
- Cliente de base de datos (Workbench)

---

## ⚙️ Configuración del backend

1. Clonar el repositorio y entrar a la carpeta `back/`:

   ```bash
   cd backend
   npm install
   ```

2. Crear el archivo `.env` en `back/` basado en `.env.example`:

   ```env
    # Servidor Express
    PORT=3001
    CORS_ORIGIN=http://localhost:5173

    # Base de datos MySQL
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=tu_usuario
    DB_PASS=tu_password
    DB_NAME=tu_base_de_datos
    DB_DIALECT=mysql

    # Autenticación JWT
    JWT_SECRET=coloca_una_clave_larga_super_secreta

   ```

   - `JWT_SECRET`: clave aleatoria usada para firmar los tokens.  
     ⚡ Genera una con:
     ```bash
     node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
     ```
   - `JWT_EXPIRES`: tiempo de expiración del token (`1h`, `1d`, `7d`, etc.).

3. Iniciar el servidor:
   ```bash
   npm run dev
   ```
   Servidor en: [http://localhost:3002/api](http://localhost:3002/api)

---

## ⚙️ Configuración del frontend

1. Entrar a la carpeta `front/`:

   ```bash
   cd frontend
   npm install
   ```

2. Configurar el archivo `src/config.js`:

   ```js
   export const API_URL = "http://localhost:3002/api";
   ```

3. Iniciar el frontend:
   ```bash
   npm run dev
   ```
   App en: [http://localhost:5173](http://localhost:5173)

---

## 🧩 Funcionalidades principales

- **Registro/Login** con JWT.
- **Carrito de compras** persistente en frontend.
- **Gestión de productos**: listado, detalle, imágenes, descripciones.
- **Sistema de órdenes**: cada usuario puede realizar pedidos.
- **Calificación de productos**: usuarios autenticados pueden dejar de 1 a 5 ⭐.
- **Base de datos** en MySQL con relaciones (Users, Products, Orders, OrderDetails, ProductRatings).

---

## 🚀 Cómo correr el proyecto completo

1. Iniciar backend:
   ```bash
   cd back
   node server.js
   ```
2. Iniciar frontend (en otra terminal):
   ```bash
   cd front
   npm run dev
   ```
3. Abrir el navegador en:  
   👉 [http://localhost:5173](http://localhost:5173)

---
