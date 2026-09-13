'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const quotes = [
  "The secret of getting ahead is getting started. — Mark Twain",
  "You don't have to be great to start, but you have to start to be great. — Zig Ziglar",
  "A goal without a plan is just a wish. — Antoine de Saint-Exupéry",
  "It always seems impossible until it's done. — Nelson Mandela",
  "Dream big. Start small. Act now. — Robin Sharma",
  "Push yourself, because no one else is going to do it for you.",
  "Success is the sum of small efforts, repeated day in and day out.",
];

interface Goal {
  id: string; title: string; emoji: string; category: string;
  deadline: string; why: string; progress: number;
  milestones: { text: string; done: boolean }[];
  notes: string; priority: string;
}

function getCountdown(deadline: string): string {
  if (!deadline) return '';
  const today = new Date(); today.setHours(0,0,0,0);
  const due = new Date(deadline); due.setHours(0,0,0,0);
  const diff = Math.round((due.getTime() - today.getTime()) / (1000*60*60*24));
  if (diff < 0) return '⚠️ Overdue';
  if (diff === 0) return '🔥 Due today!';
  if (diff === 1) return '⏰ 1 day left';
  return `⏰ ${diff} days left`;
}

const priorityConfig: Record<string, {label:string;color:string;bg:string}> = {
  High:   { label: '🔴 High',   color: '#c0392b', bg: '#fdecea' },
  Medium: { label: '🟡 Medium', color: '#d68910', bg: '#fef9e7' },
  Low:    { label: '🟢 Low',    color: '#1e8449', bg: '#eafaf1' },
};

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{name:string;avatar:string}|null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [quote, setQuote] = useState('');
  const [, setTick] = useState(0);

  useEffect(() => {
    const userData = localStorage.getItem('gb_user');
    if (!userData) { router.push('/onboarding'); return; }
    setUser(JSON.parse(userData));
    const goalsData = localStorage.getItem('gb_goals');
    if (goalsData) setGoals(JSON.parse(goalsData));
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    const interval = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(interval);
  }, [router]);

  const total = goals.length;
  const completed = goals.filter(g => g.progress === 100).length;
  const inProgress = goals.filter(g => g.progress > 0 && g.progress < 100).length;
  const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#f8f4ff', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', padding: '24px 20px', color: 'white' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '14px', opacity: 0.85, marginBottom: '4px' }}>Welcome back 👋</p>
              <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>{user.avatar} {user.name}</h1>
            </div>
            <button onClick={() => router.push('/goals/new')}
              style={{ background: 'white', color: '#7c3aed', border: 'none', borderRadius: '20px', padding: '10px 18px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>
              + Add Goal
            </button>
          </div>
          <div style={{ marginTop: '16px', background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '12px 16px', fontSize: '13px', fontStyle: 'italic', lineHeight: '1.5' }}>
            "{quote}"
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '24px' }}>
          {[
            { label: 'Total', value: total, color: '#7c3aed', bg: '#f3e8ff' },
            { label: 'In Progress', value: inProgress, color: '#2563eb', bg: '#eff6ff' },
            { label: 'Completed', value: completed, color: '#16a34a', bg: '#f0fdf4' },
            { label: 'Success Rate', value: `${successRate}%`, color: '#d97706', bg: '#fffbeb' },
          ].map(stat => (
            <div key={stat.label} style={{ background: stat.bg, borderRadius: '14px', padding: '14px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: '800', color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px', fontWeight: '500' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937', marginBottom: '14px' }}>Your Goals 🎯</h2>

        {goals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', background: 'white', borderRadius: '16px', color: '#9ca3af' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🌱</div>
            <p style={{ fontWeight: '600', color: '#374151', marginBottom: '6px' }}>No goals yet!</p>
            <p style={{ fontSize: '14px' }}>Tap "+ Add Goal" to plant your first seed.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {goals.map(goal => {
              const countdown = getCountdown(goal.deadline);
              const priority = goal.priority || 'Medium';
              const pConfig = priorityConfig[priority] || priorityConfig.Medium;
              const isOverdue = countdown.includes('Overdue');
              const isUrgent = countdown.includes('today') || countdown.includes('1 day');
              return (
                <div key={goal.id} onClick={() => router.push(`/goals/${goal.id}`)}
                  style={{ background: 'white', borderRadius: '16px', padding: '18px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f3e8ff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                      <span style={{ fontSize: '28px' }}>{goal.emoji}</span>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '16px', color: '#1f2937' }}>{goal.title}</div>
                        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{goal.category}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: pConfig.color, background: pConfig.bg, padding: '3px 8px', borderRadius: '20px', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                      {pConfig.label}
                    </span>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                      <span>Progress</span>
                      <span style={{ fontWeight: '600', color: goal.progress === 100 ? '#16a34a' : '#7c3aed' }}>{goal.progress}%</span>
                    </div>
                    <div style={{ background: '#e5e7eb', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                      <div style={{ background: goal.progress === 100 ? 'linear-gradient(90deg,#16a34a,#4ade80)' : 'linear-gradient(90deg,#7c3aed,#a855f7)', width: `${goal.progress}%`, height: '100%', borderRadius: '999px' }} />
                    </div>
                  </div>
                  {goal.progress === 100
                    ? <div style={{ fontSize: '12px', fontWeight: '700', color: '#16a34a' }}>🎉 Goal Completed!</div>
                    : goal.deadline && <div style={{ fontSize: '12px', fontWeight: '600', color: isOverdue ? '#dc2626' : isUrgent ? '#d97706' : '#6b7280' }}>{countdown}</div>
                  }
                </div>
              );
            })}
          </div>
        )}

        <button onClick={() => router.push('/calendar')}
          style={{ width: '100%', marginTop: '20px', background: 'white', border: '2px dashed #c4b5fd', borderRadius: '14px', padding: '14px', color: '#7c3aed', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>
          📅 View Calendar
        </button>

        <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '12px', marginTop: '32px' }}>Built by Mehwish © 2026</p>
      </div>
    </div>
  );
}