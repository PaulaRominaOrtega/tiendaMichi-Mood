import React, { useState } from 'react';
function Chatbot() {
    const [isOpen, setIsOpen] = useState(false); 
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([{ sender: 'bot', text: '¡Hola! Pregúntame sobre el stock, precio o características de cualquier producto.' }]);
    const EXPRESS_PORT = 3000; 
    const API_URL = `http://localhost:${EXPRESS_PORT}/api/chat`;
    
    
    const pastelColors = {
        primary: '#a2d2ff',   
        secondary: '#b8c4c2', 
        accent: '#ffb3c1',    
        lila: '#e0b5ff',      
        text: '#4a4a4a',      
        white: 'white',
        botMessage: '#f0f0f0', 
    };

    const CHATBOT_ICON_URL = '/images/icono_chatbot.jpeg'; 

    const toggleChat = () => {
        setIsOpen(!isOpen); 
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: 'user', text: input };
        setMessages((prev) => [...prev, userMessage]); 
        setInput('');

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: userMessage.text })
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}. Verifica que el servidor Express esté corriendo en el puerto ${EXPRESS_PORT}.`);
            }

            const data = await response.json();
            const botResponse = data.response || data.error || 'No se recibió una respuesta válida de la IA.';
            
            setMessages((prev) => [...prev, { sender: 'bot', text: botResponse }]);

        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            setMessages((prev) => [...prev, { sender: 'bot', text: `Lo siento, hubo un error de conexión con el servidor. Detalle: ${error.message}` }]);
        }
    };
    

    const styles = {
        container: {
            position: 'fixed',
            bottom: '35px', 
            right: '20px',
            zIndex: 1000,
        },
        floatingButton: {
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: pastelColors.primary, 
            color: pastelColors.text,
            border: `2px solid ${pastelColors.secondary}`,
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            position: 'absolute', 
            bottom: '0',
            right: '0',
            padding: 0 
        },
        chatWindow: {
            position: 'absolute',
            bottom: '90px', 
            right: '0',
            width: '350px', 
            maxHeight: '450px', 
            border: `1px solid ${pastelColors.secondary}`,
            borderRadius: '12px', 
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            backgroundColor: pastelColors.white,
            overflow: 'hidden',
        },
        chatContent: {
            padding: '15px',
            backgroundColor: pastelColors.lila, 
            display: 'flex',
            flexDirection: 'column',
            height: '450px', 
        },
        header: {
            margin: '0 0 10px 0',
            color: pastelColors.text,
            textAlign: 'center',
            paddingBottom: '5px',
            borderBottom: `1px solid ${pastelColors.secondary}`,
        },
        messageList: {
            flexGrow: 1, 
            overflowY: 'scroll', 
            padding: '10px 0', 
            marginBottom: '10px', 
            backgroundColor: pastelColors.white, 
            borderRadius: '8px'
        },
        messageText: (sender) => ({
            textAlign: sender === 'user' ? 'right' : 'left', 
            margin: '8px 10px', 
            backgroundColor: sender === 'user' ? pastelColors.accent : pastelColors.botMessage, 
            color: pastelColors.text,
            padding: '10px 12px', 
            borderRadius: '20px',
            maxWidth: '75%',
            marginLeft: sender === 'user' ? 'auto' : '10px',
            marginRight: sender === 'user' ? '10px' : 'auto',
            wordWrap: 'break-word',
            fontSize: '0.9rem'
        }),
        iconImage: {
            width: '100%', 
            height: '100%',
            borderRadius: '50%',
            objectFit: 'cover'
        },
        inputContainer: {
            display: 'flex',
            alignItems: 'center', 
            gap: '10px', 
            paddingTop: '10px',
            borderTop: `1px solid ${pastelColors.secondary}`
        },
        inputField: {
            flexGrow: 1, 
            padding: '10px', 
            borderRadius: '20px', 
            border: `1px solid ${pastelColors.secondary}`,
            color: pastelColors.text,
        },
        sendButton: {
            padding: '10px 15px', 
            borderRadius: '20px', 
            border: 'none', 
            backgroundColor: pastelColors.primary, 
            color: pastelColors.buttonText, 
            cursor: 'pointer',
            fontWeight: 'bold',
            flexShrink: 0
        }
    };


    return (
        <div style={styles.container}>
          
            {isOpen && (
                <div style={styles.chatWindow}>
                    <div style={styles.chatContent}>
                        <h3 style={styles.header}>Michi-Bot</h3>
                        <div style={styles.messageList}>
                            {messages.map((msg, index) => (
                                <p key={index} style={styles.messageText(msg.sender)}>
                                    {msg.text}
                                </p>
                            ))}
                        </div>
                        <div style={styles.inputContainer}>
                            <input 
                                type="text" 
                                value={input} 
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Ej: ¿Hay stock de tazas?"
                                style={styles.inputField}
                            />
                            <button 
                                onClick={sendMessage} 
                                style={styles.sendButton}
                            >
                                Enviar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <button 
                onClick={toggleChat} 
                style={styles.floatingButton}
                aria-label={isOpen ? "Cerrar Chatbot" : "Abrir Chatbot"}
            >
                {isOpen ? (
                    '💬'
                ) : (
                    <img 
                        src={CHATBOT_ICON_URL} 
                        alt="Abrir Chatbot" 
                        style={styles.iconImage}
                    />
                )}
            </button>

        </div>
    );
}

export default Chatbot;