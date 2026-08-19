import { useState, useEffect, useRef } from 'react';
import { apiPost } from '../api/client';
import './ChatWindow.css';

export default function ChatWindow({ monitor, mensagensIniciais, usuarioAtual, onBack, onNewData }) {
    const [mensagens, setMensagens] = useState(mensagensIniciais);
    const [novaMensagem, setNovaMensagem] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [mensagens, isSending]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!novaMensagem.trim() || isSending) return;

        const date = new Date();
        const horarioStr = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

        const msgTexto = novaMensagem.trim();
        const msg = {
            destinatario: monitor.nome,
            remetente: usuarioAtual.nome,
            texto: msgTexto,
            horario: horarioStr
        };

        setNovaMensagem('');
        setIsSending(true);

        try {
            const createdMsg = await apiPost('/mensagens/', msg);
            setMensagens([...mensagens, createdMsg]);
            if (onNewData) onNewData('Mensagem', createdMsg);
        } catch (err) {
            alert(`Falha ao enviar mensagem: ${err.message}`);
            setNovaMensagem(msgTexto); // restore text on failure
        } finally {
            setIsSending(false);
        }
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
                        <div key={msg._id || msg.id || index} className={`message ${isSentByMe ? 'sent' : 'received'}`}>
                            {msg.texto}
                            <span className="message-time">{msg.horario}</span>
                        </div>
                    );
                })}
                {isSending && (
                    <div className="message sent" style={{ opacity: 0.6 }}>
                        <span className="sending-indicator">Enviando...</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-area" onSubmit={handleSend}>
                <input 
                    type="text" 
                    placeholder="Digite sua mensagem..." 
                    value={novaMensagem}
                    onChange={(e) => setNovaMensagem(e.target.value)}
                    disabled={isSending}
                />
                <button type="submit" className="send-btn" disabled={!novaMensagem.trim() || isSending}>
                    ➤
                </button>
            </form>
        </div>
    );
}
