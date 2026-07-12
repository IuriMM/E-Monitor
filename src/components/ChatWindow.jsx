import React, { useState, useEffect, useRef } from 'react';
import './ChatWindow.css';

export default function ChatWindow({ monitor, mensagensIniciais, usuarioAtual, onBack }) {
    const [mensagens, setMensagens] = useState(mensagensIniciais);
    const [novaMensagem, setNovaMensagem] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [mensagens]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!novaMensagem.trim()) return;

        const date = new Date();
        const horarioStr = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

        const msg = {
            remetente: usuarioAtual.nome, // As sent by the current user
            texto: novaMensagem.trim(),
            horario: horarioStr
        };

        setMensagens([...mensagens, msg]);
        setNovaMensagem('');
    };

    return (
        <div className="chat-window">
            <div className="chat-header">
                <button className="back-btn" onClick={onBack}>
                    &larr;
                </button>
                <div className="chat-header-info">
                    <h2>{monitor.nome}</h2>
                    <p>Monitor(a) de {monitor.materiaNome}</p>
                </div>
            </div>

            <div className="chat-messages">
                {mensagens.map((msg, index) => {
                    const isSentByMe = msg.remetente === usuarioAtual.nome;
                    return (
                        <div key={index} className={`message ${isSentByMe ? 'sent' : 'received'}`}>
                            {msg.texto}
                            <span className="message-time">{msg.horario}</span>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-area" onSubmit={handleSend}>
                <input 
                    type="text" 
                    placeholder="Digite sua mensagem..." 
                    value={novaMensagem}
                    onChange={(e) => setNovaMensagem(e.target.value)}
                />
                <button type="submit" className="send-btn" disabled={!novaMensagem.trim()}>
                    ➤
                </button>
            </form>
        </div>
    );
}
