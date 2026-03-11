# ERP FERRETERÍA EL ABUELO 🔨

Sistema Integral de Gestión de Recursos (ERP) diseñado específicamente para el sector ferretero. Este sistema permite un control total sobre inventarios, ventas, clientes y proveedores con una arquitectura moderna y segura.

---

## ✨ Módulos Principales

### 📦 Gestión de Inventario
- **Control de Productos**: Manejo de SKU, categorías, stock inicial, stock mínimo y unidad de medida.
- **Alertas de Stock**: Notificaciones inteligentes cuando los productos están por agotarse.
- **Validación de Precios**: No permite ventas por debajo del precio de adquisición.

### 🧾 Módulo de Compras (CRUD)
- **Historial Completo**: Consulta de todas las compras realizadas a proveedores.
- **Anulación Automática**: Permite anular compras, lo cual revierte automáticamente el stock del inventario.
- **Cálculo de Precios**: Herramienta integrada para calcular Precio de Venta basado en % de Ganancia (o viceversa) durante el ingreso.

### 💰 Ventas y Facturación
- **Caja / Punto de Venta**: Carrito de compras intuitivo para facturación rápida.
- **Cálculos Automáticos**: Gestión de IVA (19%), descuentos por ítem y totales.
- **Generación de PDF**: Creación de facturas profesionales para descarga inmediata.

### 📊 Dashboard de Control
- **Métricas en Tiempo Real**: Visualización de Ventas del Día y totales históricos.
- **Estadísticas de Productos**: Ranking de los 5 productos más vendidos.
- **Panel de Alertas**: Listado directo de productos que requieren reposición inmediata.

### 🔐 Seguridad y Experiencia
- **Notificaciones Premium**: Sistema de "Toasts" profesionales para confirmaciones y errores (sin alertas de navegador).
- **Roles Definidos**: SUPER ADMIN, Admin y User con permisos granulares.

---

## 🚀 Guía de Instalación y Pruebas

### 1. Preparar la Base de Datos
- Ejecuta el script SQL ubicado en: `database/ferreteria_el_abuelo_db.sql`.
- Esto creará la base de datos `ferreteria_el_abuelo_db` y los roles iniciales.

### 2. Iniciar en Desarrollo

**Backend (Java/Spring Boot):**
```bash
cd backend
./mvnw spring-boot:run
```

**Frontend (React/Vite):**
```bash
cd frontend
npm install
npm run dev
```

---

## 🔨 Compilación para Producción

Si deseas generar los archivos listos para despliegue:

### Frontend
Genera la carpeta `dist` con los archivos estáticos optimizados:
```bash
cd frontend
npm run build
```

### Backend
Genera el archivo `.jar` ejecutable:
```bash
cd backend
./mvnw clean package
```
El archivo generado estará en `backend/target/system_erp-0.0.1-SNAPSHOT.jar`.

---

## 🛠️ Stack Tecnológico
- **Backend**: Java 17, Spring Boot 3, Spring Security, JWT, JPA/Hibernate, MySQL.
- **Frontend**: React 19, Vite, Tailwind CSS 4, Axios, React Router.

---
> [!NOTE]
> Este sistema es una solución integral personalizada para **Ferretería El Abuelo**, optimizando procesos de inventario y flujo de caja con estándares modernos.
