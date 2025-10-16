// src/components/Chatbot.jsx
import React, { useState, useEffect } from 'react';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const welcomeMessage = {
                text: '¡Hola! Soy Michi-Bot de Ayuda. ¿En qué puedo ayudarte hoy? Puedes preguntar sobre nuestros productos, envíos, medios de pago o crear tu propio producto personalizado.',
                from: 'bot'
            };
            setMessages([welcomeMessage]);
        }
    }, [isOpen, messages.length]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, from: 'user' };
        setMessages(prevMessages => [...prevMessages, userMessage]);

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

        try {
            const response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: input
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            const botMessage = {
                text: data.message,
                from: 'bot',
                imageUrl: data.imageData?.imageUrl
            };
            setMessages(prevMessages => [...prevMessages, botMessage]);

            if (data.imageGenerated && data.imageData) {
                console.log('¡El bot generó una imagen!', data.imageData.imageUrl);
            }

        } catch (error) {
            console.error('Error al comunicarse con la API:', error);
            const errorMessage = {
                text: '¡Ups! Algo salió mal al conectar con el servidor. Por favor, verifica que el backend esté funcionando e intenta de nuevo.',
                from: 'bot'
            };
            setMessages(prevMessages => [...prevMessages, errorMessage]);
        }

        setInput('');
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <div 
                onClick={toggleChat}
                className="fixed bottom-6 right-6 z-50 cursor-pointer flex flex-col items-center transform transition-transform hover:scale-105"
            >
    
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white shadow-lg border border-gray-300">
                    <img 
                        src="/images/avatar.jpeg"
                        alt="Chatbot de Michis" 
                        className="w-12 h-12"
                    />
                </div>
                <span className="mt-1 text-sm text-gray-700 font-semibold">Michi-Bot de Ayuda</span>
            </div>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-80 h-96 bg-white border border-gray-300 rounded-xl shadow-lg flex flex-col z-50 overflow-hidden">
                    <div className="flex-grow p-4 overflow-y-auto flex flex-col space-y-2">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg max-w-[80%] break-words ${
                                    msg.from === 'user'
                                        ? 'bg-blue-500 text-white self-end rounded-br-lg'
                                        : 'bg-gray-200 text-black self-start rounded-bl-lg'
                                }`}
                            >
                                {msg.text}
                                {msg.imageUrl && (
                                    <img src={msg.imageUrl} alt="Producto generado por IA" className="mt-2 rounded-lg" />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="p-2 border-t border-gray-300 flex">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    sendMessage();
                                }
                            }}
                            className="flex-grow p-2 rounded-lg border border-gray-300 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Escribe un mensaje..."
                        />
                        <button
                            onClick={sendMessage}
                            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Enviar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;