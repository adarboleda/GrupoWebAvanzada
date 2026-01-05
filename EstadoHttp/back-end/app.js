// ============================================
// API de Gestión de Pedidos - Soft&Hard
// Ejercicio de Estados HTTP con Express
// ============================================

// Importación de frameworks
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para permitir uso de JSON
app.use(express.json());

// Array para almacenar pedidos
let pedidos = [
    { id: 1, cliente: "Juan Pérez", producto: "Laptop", cantidad: 1, estado: "pendiente" },
    { id: 2, cliente: "María López", producto: "Mouse", cantidad: 2, estado: "enviado" }
];

// ============================================
// ESTADOS 2XX - RESPUESTAS EXITOSAS
// ============================================

// 200 OK - Obtener todos los pedidos
app.get('/api/pedidos', (req, res) => {
    res.status(200).json({
        mensaje: "Pedidos obtenidos exitosamente",
        total: pedidos.length,
        datos: pedidos
    });
});

// 200 OK - Obtener un pedido específico
app.get('/api/pedidos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pedido = pedidos.find(p => p.id === id);
    
    if (pedido) {
        res.status(200).json({
            mensaje: "Pedido encontrado",
            datos: pedido
        });
    } else {
        res.status(404).json({
            error: "Pedido no encontrado"
        });
    }
});

// 201 Created - Crear un nuevo pedido
app.post('/api/pedidos', (req, res) => {
    const { cliente, producto, cantidad } = req.body;
    
    if (!cliente || !producto || !cantidad) {
        return res.status(400).json({
            error: "Faltan datos requeridos: cliente, producto y cantidad son obligatorios"
        });
    }
    
    const nuevoPedido = {
        id: pedidos.length + 1,
        cliente,
        producto,
        cantidad,
        estado: "pendiente"
    };
    
    pedidos.push(nuevoPedido);
    
    res.status(201).json({
        mensaje: "Pedido creado exitosamente",
        datos: nuevoPedido
    });
});

// 204 No Content - Eliminar un pedido
app.delete('/api/pedidos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const indice = pedidos.findIndex(p => p.id === id);
    
    if (indice !== -1) {
        pedidos.splice(indice, 1);
        res.status(204).send(); // No envía contenido
    } else {
        res.status(404).json({
            error: "Pedido no encontrado"
        });
    }
});

// ============================================
// ESTADOS 3XX - REDIRECCIONES
// ============================================

// 301 Moved Permanently - Redirección permanente
app.get('/pedidos', (req, res) => {
    res.status(301).redirect('/api/pedidos');
});

// 302 Found - Redirección temporal
app.get('/api/orden/:id', (req, res) => {
    res.status(302).redirect(`/api/pedidos/${req.params.id}`);
});

// 304 Not Modified - Recurso no modificado (simulación)
app.get('/api/pedidos/cache/:id', (req, res) => {
    const etag = req.headers['if-none-match'];
    const pedidoEtag = "12345-version1";
    
    if (etag === pedidoEtag) {
        res.status(304).send(); // El recurso no ha cambiado
    } else {
        const pedido = pedidos.find(p => p.id === parseInt(req.params.id));
        res.set('ETag', pedidoEtag);
        res.status(200).json(pedido);
    }
});

// ============================================
// ESTADOS 4XX - ERRORES DEL CLIENTE
// ============================================

// 400 Bad Request - Solicitud incorrecta
app.post('/api/pedidos/validar', (req, res) => {
    const { cantidad } = req.body;
    
    if (!cantidad || cantidad <= 0) {
        return res.status(400).json({
            error: "Solicitud incorrecta",
            mensaje: "La cantidad debe ser un número mayor a 0"
        });
    }
    
    res.status(200).json({
        mensaje: "Validación exitosa"
    });
});

// 401 Unauthorized - No autorizado
app.get('/api/pedidos/admin', (req, res) => {
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(401).json({
            error: "No autorizado",
            mensaje: "Se requiere un token de autenticación"
        });
    }
    
    res.status(200).json({
        mensaje: "Acceso autorizado al panel de administración",
        datos: pedidos
    });
});

// 403 Forbidden - Prohibido
app.delete('/api/pedidos/admin/:id', (req, res) => {
    const userRole = req.headers['user-role'];
    
    if (userRole !== 'admin') {
        return res.status(403).json({
            error: "Prohibido",
            mensaje: "No tienes permisos para eliminar pedidos. Solo los administradores pueden realizar esta acción."
        });
    }
    
    const id = parseInt(req.params.id);
    const indice = pedidos.findIndex(p => p.id === id);
    
    if (indice !== -1) {
        pedidos.splice(indice, 1);
        res.status(200).json({
            mensaje: "Pedido eliminado por administrador"
        });
    } else {
        res.status(404).json({
            error: "Pedido no encontrado"
        });
    }
});

// 404 Not Found - Recurso no encontrado
app.get('/api/productos/:id', (req, res) => {
    res.status(404).json({
        error: "Recurso no encontrado",
        mensaje: "El producto solicitado no existe en la base de datos"
    });
});

// ============================================
// ESTADOS 5XX - ERRORES DEL SERVIDOR
// ============================================

// 500 Internal Server Error - Error interno del servidor
app.get('/api/pedidos/error', (req, res) => {
    try {
        // Simulamos un error en el servidor
        throw new Error("Error crítico en la base de datos");
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor",
            mensaje: "Ha ocurrido un error inesperado en el servidor",
            detalles: error.message
        });
    }
});

// 502 Bad Gateway - Puerta de enlace incorrecta
app.get('/api/pedidos/external', (req, res) => {
    res.status(502).json({
        error: "Puerta de enlace incorrecta",
        mensaje: "El servidor no pudo obtener una respuesta válida del servicio externo"
    });
});

// ============================================
// RUTA PRINCIPAL
// ============================================

app.get('/', (req, res) => {
    res.status(200).json({
        mensaje: "Bienvenido a la API de Soft&Hard - Gestión de Pedidos",
        version: "1.0.0",
        endpoints: {
            pedidos: "/api/pedidos",
            documentacion: "Consulta el README.md para más información"
        }
    });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

app.listen(PORT, () => {
    console.log(`✅ Servidor de Soft&Hard iniciado en http://localhost:${PORT}`);
    console.log(`📝 Total de pedidos iniciales: ${pedidos.length}`);
    console.log(`🚀 Prueba los endpoints con Postman o curl`);
});