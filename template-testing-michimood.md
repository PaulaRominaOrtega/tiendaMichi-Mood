# TESTING - PROYECTO MICHIMOOD

## 1. DESCRIPCIÓN DEL PROYECTO

### Información General
- **Nombre:** MichiMood - E-commerce de productos para amantes de gatos
- **Tecnologías:** React + Node.js + MySQL + Express
- **Tipo:** Aplicación web full-stack

### Funcionalidades Principales
1. Gestión de Productos (CRUD)
2. Gestión de Categorías (CRUD) 
3. Gestión de Clientes (CRUD)
4. Sistema de Autenticación
5. Chatbot con IA
6. Carrito de compras

## 2. REQUERIMIENTOS FUNCIONALES - GESTIÓN DE PRODUCTOS

### RF-001: Autenticación de Administrador
**Descripción:** El sistema debe permitir que solo administradores autenticados gestionen productos
**Criterios de Aceptación:**
- Login con email y contraseña válidos
- Token JWT para autorización
- Redirección automática si no está autenticado

### RF-002: Crear Producto
**Descripción:** Un administrador debe poder crear nuevos productos
**Criterios de Aceptación:**
- Campos obligatorios: nombre, precio, stock, categoría, administrador
- Campos opcionales: descripción, imagen, material, capacidad
- Validación de tipos de datos
- Precio mayor a 0, stock mayor o igual a 0

### RF-003: Listar Productos
**Descripción:** El sistema debe mostrar lista de productos con paginación
**Criterios de Aceptación:**
- Mostrar solo productos activos
- Paginación (10 productos por página)
- Incluir información de categoría y administrador

### RF-004: Editar Producto
**Descripción:** Un administrador debe poder modificar productos existentes
**Criterios de Aceptación:**
- Solo productos activos pueden editarse
- Validaciones iguales a creación
- Actualización exitosa en base de datos

### RF-005: Eliminar Producto (Soft Delete)
**Descripción:** Un administrador debe poder "eliminar" productos (marcar como inactivo)
**Criterios de Aceptación:**
- Confirmación antes de eliminar
- Soft delete (activo = false)
- Producto no aparece en listados públicos

## 3. CASOS DE PRUEBA

### CP-001: Login Administrador Exitoso
- **Precondición:** Administrador registrado en BD
- **Datos:** email: admin@test.com, password: Admin123
- **Pasos:** 1) Ir a /admin/login 2) Ingresar credenciales 3) Click "Iniciar Sesión"
- **Resultado Esperado:** Redirección a /admin con token guardado

### CP-002: Crear Producto Válido
- **Precondición:** Administrador logueado
- **Datos:** nombre: "Taza Gato", precio: 1500, stock: 10, categoría: 1
- **Pasos:** 1) Ir a productos 2) Click "Agregar" 3) Completar form 4) Guardar
- **Resultado Esperado:** Producto creado, mensaje éxito, aparece en lista

### CP-003: Crear Producto Sin Autenticación
- **Precondición:** Usuario no logueado
- **Pasos:** 1) Intentar POST a /api/productos
- **Resultado Esperado:** Error 401 - No autorizado

### CP-004: Crear Producto Campos Vacíos
- **Precondición:** Administrador logueado
- **Datos:** nombre: "", precio: "", stock: ""
- **Resultado Esperado:** Errores de validación, producto no creado

### CP-005: Editar Producto Existente
- **Precondición:** Producto ID=1 existe y admin logueado
- **Datos:** Cambiar nombre a "Taza Gato Editada"
- **Resultado Esperado:** Producto actualizado correctamente

### CP-006: Eliminar Producto
- **Precondición:** Producto ID=1 existe y admin logueado
- **Pasos:** 1) Click eliminar 2) Confirmar
- **Resultado Esperado:** Producto marcado como inactivo

### CP-007: Listar Productos con Paginación
- **Precondición:** Existen productos en BD
- **Pasos:** 1) GET /api/productos?page=1&limit=10
- **Resultado Esperado:** Lista de 10 productos máximo + info paginación

## 4. MATRIZ DE TRAZABILIDAD

| Caso de Prueba | Requerimiento | Estado | Prioridad |
|----------------|---------------|---------|-----------|
| CP-001 | RF-001 | Pendiente | Alta |
| CP-002 | RF-002 | Pendiente | Alta |
| CP-003 | RF-001 | Pendiente | Alta |
| CP-004 | RF-002 | Pendiente | Media |
| CP-005 | RF-004 | Pendiente | Alta |
| CP-006 | RF-005 | Pendiente | Alta |
| CP-007 | RF-003 | Pendiente | Media |

## 5. RESULTADOS DE EJECUCIÓN
(Completar durante la ejecución)

## 6. CONCLUSIONES
(Completar al final)