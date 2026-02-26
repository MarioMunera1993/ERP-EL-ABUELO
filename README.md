# ERP FERRETERÍA EL ABUELO 🔨

Sistema Integral de Gestión de Recursos (ERP) diseñado específicamente para el sector ferretero. Este sistema permite un control total sobre inventarios, ventas, clientes y proveedores con una arquitectura moderna y segura.

---

## ✨ Módulos Principales

### 📦 Gestión de Inventario
- **Control de Productos**: Manejo de SKU, categorías, stock inicial, stock mínimo y unidad de medida (selección de lista predefinida).
- **Alertas de Stock**: Notificaciones inteligentes cuando los productos están por agotarse.
- **Validación de Precios**: No permite ventas por debajo del precio de adquisición.

### 💰 Ventas y Facturación
- **Caja / Punto de Venta**: Carrito de compras intuitivo para facturación rápida.
- **Cálculos Automáticos**: Gestión de IVA (19%), descuentos y totales.
- **Registro de Vendedores**: Control automático de quién realizó la transacción.

### 👥 Directorio de Terceros
- **Clientes**: Base de datos de clientes corporativos y personas naturales (CC/NIT).
- **Proveedores**: Gestión de contactos para reabastecimiento.

### 🔐 Seguridad por Roles
- **SUPER ADMIN**: Control absoluto (CRUD y eliminaciones).
- **Admin**: Gestión operativa completa (sin permisos de borrado).
- **User**: Perfil operativo (Ventas, consultas y compras).

---

## 🚀 Guía de Pruebas y Funcionamiento

### 1. Preparar la Base de Datos
- Ejecuta el script SQL ubicado en: `database/ferreteria_el_abuelo_db.sql`.
- Esto creará la base de datos `ferreteria_el_abuelo_db` y los roles iniciales.

> **Migración de unidades de medida**: si ya tienes productos en la tabla `products` y el campo `unit` contenía textos libres ("unidades", "kg", etc.), antes de iniciar la aplicación actualizada conviene normalizar esos valores porque ahora se usan constantes del tipo `METROS`,`KILOGRAMOS`, etc. Por ejemplo:
> ```sql
> UPDATE products
> SET unit = 'UNIDAD'
> WHERE unit IS NULL OR unit = '' OR unit = 'unidades';
> 
> UPDATE products
> SET unit = 'KILOGRAMOS'
> WHERE unit LIKE '%kg%';
> ```
> Ajusta según tus datos; cualquier valor no reconocido hará que Spring Boot lance un error al leer el registro.

### 2. Iniciar el Backend (Java/Spring Boot)
Asegúrate de estar en la carpeta raíz:
```bash
cd backend
./mvnw spring-boot:run
```

### 3. Iniciar el Frontend (React/Vite)
En una nueva terminal:
```bash
cd frontend
npm run dev
```

> **Nota:** el campo "Unidad de medida" ahora se elige de un menú con opciones como metros, kg, litros, docenas, etc. Esto ayuda a estandarizar los productos y facilita los cálculos de stock.

### 4. Acceso Inicial
- **URL**: `http://localhost:5173`
- **Usuario**: `admin`
- **Contraseña**: `123456`

---

## 🛠️ Stack Tecnológico
- **Backend**: Java 17, Spring Boot 3, Spring Security, JWT, JPA/Hibernate, MySQL.
- **Frontend**: React 19, Vite, Tailwind CSS 4, Axios, React Router.

---
> [!NOTE]
> Este sistema fue transformado de un inventario de equipos tecnológicos a un ERP completo para ferretería para satisfacer las necesidades de **Ferretería El Abuelo**.
