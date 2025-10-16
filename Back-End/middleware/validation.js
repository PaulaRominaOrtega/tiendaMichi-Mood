const { body, param, query } = require('express-validator');
//validacion admin
const validateAdministradorCreate = [
    body('usuario')
        .notEmpty()
        .withMessage('El usuario es requerido')
        .isLength({ min: 2, max: 50 })
        .withMessage('El usuario debe tener entre 2 y 50 caracteres'),
    body('contrasena')
        .notEmpty()
        .withMessage('La contraseña es requerida')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('email')
        .notEmpty()
        .withMessage('El email es requerido')
        .isEmail()
        .withMessage('Debe ser un email válido')
        .normalizeEmail()
];

const validateAdministradorUpdate = [
    body('usuario')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('El usuario debe tener entre 2 y 50 caracteres'),
    body('contrasena')
        .optional()
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Debe ser un email válido')
        .normalizeEmail(),
    body('activa')
        .optional()
        .isBoolean()
        .withMessage('El campo activa debe ser verdadero o falso')
];

const validateAdministradorId = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El ID debe ser un número entero positivo')
];


//validacion cliente
const validateClienteCreate = [
    body('nombre')
        .notEmpty()
        .withMessage('El nombre es requerido')
        .isLength({ min: 2, max: 50 })
        .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
    body('telefono')
        .optional()
        .isString()
        .isLength({ min: 7, max: 15 })
        .withMessage('El teléfono debe tener entre 7 y 15 dígitos')
        .matches(/^\d+$/)
        .withMessage('El teléfono solo puede contener números'),
    body('email')
        .notEmpty()
        .withMessage('El email es requerido')
        .isEmail()
        .withMessage('Debe ser un email válido')
        .normalizeEmail(),
    body('contrasena')
        .notEmpty()
        .withMessage('La contraseña es requerida')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
];

const validateClienteUpdate = [
    body('nombre')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
    body('telefono')
        .optional()
        .isString()
        .isLength({ min: 7, max: 15 })
        .withMessage('El teléfono debe tener entre 7 y 15 dígitos')
        .matches(/^\d+$/)
        .withMessage('El teléfono solo puede contener números'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Debe ser un email válido')
        .normalizeEmail(),
    body('contrasena')
        .optional()
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
];

const validateClienteId = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El ID debe ser un número entero positivo')
];


//validacion categoria
const validateCategoriaCreate = [
    body('nombre')
        .notEmpty()
        .withMessage('El nombre es requerido')
        .isLength({ min: 2, max: 50 })
        .withMessage('El nombre debe tener entre 2 y 50 caracteres')
];

const validateCategoriaUpdate = [
    body('nombre')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    body('descripcion')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('La descripción no puede exceder 1000 caracteres')
];

const validateCategoriaId = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El ID debe ser un número entero positivo')
];


//validacion productos 
const validateProductoCreate = [
    body('nombre')
        .notEmpty()
        .withMessage('El nombre es requerido')
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    body('precio')
        .isFloat({ min: 0 })
        .withMessage('El precio debe ser un número mayor o igual a 0'),
    body('stock')
        .isInt({ min: 0 })
        .withMessage('El stock debe ser un número entero mayor o igual a 0'),
    body('categoriaId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('El ID de categoría debe ser un número entero positivo'),
    body('descripcion')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('La descripción no puede exceder 1000 caracteres')
];

const validateProductoUpdate = [
    body('nombre')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    body('precio')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('El precio debe ser un número mayor o igual a 0'),
    body('stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('El stock debe ser un número entero mayor o igual a 0'),
    body('categoriaId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('El ID de categoría debe ser un número entero positivo'),
    body('descripcion')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('La descripción no puede exceder 1000 caracteres')
];

const validateProductoId = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El ID debe ser un número entero positivo')
];


const validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('La página debe ser un número entero positivo'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('El límite debe ser un número entre 1 y 100')
];


module.exports = {
    validateProductoCreate,
    validateProductoUpdate,
    validateProductoId,
    validatePagination,
    validateCategoriaCreate,
    validateCategoriaUpdate,
    validateCategoriaId,
    validateAdministradorCreate,
    validateAdministradorUpdate,
    validateAdministradorId,  
    validateClienteCreate,
    validateClienteUpdate,
    validateClienteId,
};