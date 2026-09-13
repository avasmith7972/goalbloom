'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Goal = { id: string; title: string; deadline: string; emoji: string; completed: boolean; };

export default function Calendar() {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [currentDate] = useState(new Date());

  useEffect(() => {
    const stored = localStorage.getItem('gb_goals');
    if (stored) setGoals(JSON.parse(stored));
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const getGoalsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return goals.filter(g => g.deadline === dateStr);
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div style={{ minHeight: '100vh', background: '#f8f4ff', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button onClick={() => router.push('/')} style={{ background: 'white', border: 'none', borderRadius: '12px', padding: '10px 14px', cursor: 'pointer', fontSize: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>←</button>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1f2937' }}>📅 Goal Calendar</h1>
      </div>

      <div style={{ background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', color: '#7c3aed', marginBottom: '16px' }}>
          {monthNames[month]} {year}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
          {dayNames.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280', padding: '4px' }}>{d}</div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;
            const dayGoals = getGoalsForDay(day);
            const isToday = day === currentDate.getDate();
            return (
              <div key={i} style={{ minHeight: '50px', borderRadius: '10px', padding: '4px', background: isToday ? '#f3e8ff' : '#fafafa', border: isToday ? '2px solid #7c3aed' : '1px solid #e5e7eb', textAlign: 'center' }}>
                <div style={{ fontSize: '13px', fontWeight: isToday ? '700' : '400', color: isToday ? '#7c3aed' : '#374151' }}>{day}</div>
                {dayGoals.map(g => (
                  <div key={g.id} onClick={() => router.push(`/goals/${g.id}`)}
                    style={{ fontSize: '16px', cursor: 'pointer', marginTop: '2px' }} title={g.title}>
                    {g.emoji}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming deadlines */}
      <div style={{ background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px' }}>⏳ Upcoming Deadlines</h2>
        {goals.length === 0 ? (
          <p style={{ color: '#9ca3af', textAlign: 'center' }}>No goals yet! Add some from the dashboard 🌱</p>
        ) : (
          goals
            .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
            .map(g => {
              const days = Math.ceil((new Date(g.deadline).getTime() - Date.now()) / 86400000);
              return (
                <div key={g.id} onClick={() => router.push(`/goals/${g.id}`)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '12px', background: '#fafafa', marginBottom: '8px', cursor: 'pointer', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontSize: '24px' }}>{g.emoji}</span>
                    <div>
                      <p style={{ fontWeight: '600', fontSize: '14px', color: '#1f2937' }}>{g.title}</p>
                      <p style={{ fontSize: '12px', color: '#6b7280' }}>Due {g.deadline}</p>
                    </div>
                  </div>
                  <span style={{ background: days < 7 ? '#fee2e2' : '#f3e8ff', color: days < 7 ? '#dc2626' : '#7c3aed', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                    {days > 0 ? `${days}d left` : '⚠️ Overdue'}
                  </span>
                </div>
              );
            })
        )}
      </div>

      <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '12px', marginTop: '20px' }}>Built by Mehwish © 2026</p>
    </div>
  );
}