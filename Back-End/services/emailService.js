const nodemailer = require('nodemailer');

const user = process.env.MAIL_USER; 
const pass = process.env.MAIL_PASS; 

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: user, 
        pass: pass  
    },
});

const sendNewOrderEmail = async ({ to, subject, data }) => {
    
    if (!user || !pass) {
        console.warn(`[NodeMailer SIMULADO]: Variables de entorno MAIL_USER o MAIL_PASS no encontradas. Email a ${to} con asunto: ${subject}`);
        console.log('Datos del pedido:', data);
        return; 
    }
    
    const itemsHtml = data.items.map(item => `
        <li>
            ${item.cantidad} x 
            <strong>${item.nombre || `Producto ID ${item.productoId}`}</strong> 
            ($${item.precioUnitario.toFixed(2)} c/u)
        </li>
    `).join('');
    
    try {
        await transporter.sendMail({
            from: `"Tu Tienda Michi" <${user}>`, 
            to: to,
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>¡🚨 Nuevo Pedido #${data.pedidoId} Recibido!</h2>
                    <p>El cliente <strong>${data.clienteNombre}</strong> ha realizado un nuevo pedido.</p>
                    <p><strong>Total del Pedido:</strong> <span style="font-size: 1.2em; color: #2a6496;">$${data.total.toFixed(2)}</span></p>
                    
                    <h3>Detalles del Carrito:</h3>
                    <ul style="list-style-type: none; padding: 0;">
                        ${itemsHtml}
                    </ul>
                    
                    <hr />
                    <p>Por favor, revisa tu panel de administración para procesar la orden lo antes posible.</p>
                </div>
            `, 
        });
        console.log(`[NodeMailer REAL]: Correo de pedido #${data.pedidoId} enviado exitosamente a ${to}`);
    } catch (error) {
        console.error("Error al enviar el correo con NodeMailer:", error.message);
    }
};

module.exports = {
    sendNewOrderEmail,
};