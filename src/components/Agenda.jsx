import { useState } from 'react';
import './Agenda.css';

export default function Agenda({ provas = [], materias = {} }) {
    const today = new Date();
    // Use state to keep track of the currently viewed month and year
    const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

    const goToToday = () => {
        setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextYear = () => {
        setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1));
    };

    const prevYear = () => {
        setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1));
    };

    // Helper functions for rendering the calendar grid
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const monthNames = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    const renderDays = () => {
        const days = [];
        
        // Empty slots for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="agenda-day empty"></div>);
        }

        // The actual days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            // Create a string like "2025-05-24" to match the DB
            const monthStr = String(currentDate.getMonth() + 1).padStart(2, '0');
            const dayStr = String(day).padStart(2, '0');
            const dateStr = `${currentDate.getFullYear()}-${monthStr}-${dayStr}`;
            
            // Check if this day is today
            const isToday = day === today.getDate() && 
                            currentDate.getMonth() === today.getMonth() && 
                            currentDate.getFullYear() === today.getFullYear();
            
            // Check if there are provas on this day
            const provasDoDia = provas.filter(prova => prova.dia === dateStr);
            const hasProva = provasDoDia.length > 0;

            days.push(
                <div key={day} className={`agenda-day ${isToday ? 'today' : ''} ${hasProva ? 'has-prova' : ''}`}>
                    <span className="day-number">{day}</span>
                    {hasProva && (
                        <>
                            <span className="prova-indicator"></span>
                            <span className="tooltip">
                                {provasDoDia.map((p, idx) => {
                                    const nomeMateria = p.materia && materias[p.materia] ? materias[p.materia].nome : p.materia;
                                    return (
                                        <div key={idx}>
                                            {nomeMateria ? `${nomeMateria} - ` : ''}{p.nome || 'Prova'}
                                        </div>
                                    );
                                })}
                            </span>
                        </>
                    )}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="agenda">
            <div className="agenda-header">
                <div className="agenda-nav">
                    <button onClick={prevYear} title="Ano anterior">&lt;&lt;</button>
                    <button onClick={prevMonth} title="Mês anterior">&lt;</button>
                </div>
                <div className="agenda-title">
                    <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                    <button className="today-btn" onClick={goToToday}>Hoje</button>
                </div>
                <div className="agenda-nav">
                    <button onClick={nextMonth} title="Próximo mês">&gt;</button>
                    <button onClick={nextYear} title="Próximo ano">&gt;&gt;</button>
                </div>
            </div>
            <div className="agenda-grid">
                {dayNames.map(day => (
                    <div key={day} className="agenda-day-name">{day}</div>
                ))}
                {renderDays()}
            </div>
        </div>
    );
}