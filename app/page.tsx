'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const quotes = [
  "Every big journey begins with a single step. 🚀",
  "Your goals are valid. Keep going! 💪",
  "Bloom where you are planted. 🌸",
  "Small progress is still progress. 🌟",
  "You've got this! One goal at a time. 🎯",
];

type Goal = {
  id: string;
  title: string;
  category: string;
  deadline: string;
  progress: number;
  completed: boolean;
  emoji: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; avatar: string } | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [quote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  useEffect(() => {
    const stored = localStorage.getItem('gb_user');
    if (!stored) { router.push('/onboarding'); return; }
    setUser(JSON.parse(stored));
    const storedGoals = localStorage.getItem('gb_goals');
    if (storedGoals) setGoals(JSON.parse(storedGoals));
  }, [router]);

  const completed = goals.filter(g => g.completed).length;
  const inProgress = goals.filter(g => !g.completed).length;

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#f8f4ff', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', borderRadius: '20px', padding: '24px', color: 'white', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ opacity: 0.8, fontSize: '14px' }}>Good day,</p>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>{user.avatar} {user.name}!</h1>
            <p style={{ opacity: 0.8, fontSize: '13px', marginTop: '4px' }}>Let's bloom today 🌸</p>
          </div>
          <button onClick={() => router.push('/calendar')}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '10px', borderRadius: '12px', cursor: 'pointer', fontSize: '20px' }}>
            📅
          </button>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '12px', marginTop: '16px', fontSize: '13px', fontStyle: 'italic' }}>
          "{quote}"
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Total Goals', value: goals.length, emoji: '🎯', color: '#7c3aed' },
          { label: 'In Progress', value: inProgress, emoji: '⚡', color: '#f59e0b' },
          { label: 'Completed', value: completed, emoji: '✅', color: '#10b981' },
        ].map(stat => (
          <div key={stat.label} style={{ background: 'white', borderRadius: '16px', padding: '16px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '24px' }}>{stat.emoji}</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '11px', color: '#6b7280' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Goals List */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>My Goals 🎯</h2>
        <button onClick={() => router.push('/goals/new')}
          style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
          + Add Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '20px', padding: '40px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🌱</div>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>No goals yet!</p>
          <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '4px' }}>Tap "+ Add Goal" to plant your first seed 🌸</p>
        </div>
      ) : (
        goals.map(goal => (
          <div key={goal.id} onClick={() => router.push(`/goals/${goal.id}`)}
            style={{ background: 'white', borderRadius: '16px', padding: '16px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '28px' }}>{goal.emoji}</span>
                <div>
                  <h3 style={{ fontWeight: '600', color: '#1f2937', fontSize: '15px' }}>{goal.title}</h3>
                  <p style={{ color: '#9ca3af', fontSize: '12px' }}>{goal.category} · Due {goal.deadline}</p>
                </div>
              </div>
              <span style={{ background: goal.completed ? '#d1fae5' : '#fef3c7', color: goal.completed ? '#065f46' : '#92400e', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                {goal.completed ? '✅ Done' : '⚡ Active'}
              </span>
            </div>
            <div style={{ marginTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                <span>Progress</span><span>{goal.progress}%</span>
              </div>
              <div style={{ background: '#e5e7eb', borderRadius: '999px', height: '8px' }}>
                <div style={{ background: 'linear-gradient(90deg, #7c3aed, #4f46e5)', height: '8px', borderRadius: '999px', width: `${goal.progress}%`, transition: 'width 0.3s' }} />
              </div>
            </div>
          </div>
        ))
      )}

      <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '12px', marginTop: '24px' }}>Built by Mehwish © 2026</p>
    </div>
  );
}