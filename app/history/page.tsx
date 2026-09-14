'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Goal {
  id: string; title: string; emoji: string; category: string;
  deadline: string; why: string; progress: number;
  milestones: { text: string; done: boolean }[];
  notes: string; priority: string;
  type?: 'deleted'; archivedAt?: string;
}

export default function History() {
  const router = useRouter();
  const [completedGoals, setCompletedGoals] = useState<Goal[]>([]);
  const [deletedGoals, setDeletedGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const goals: Goal[] = JSON.parse(localStorage.getItem('gb_goals') || '[]');
    setCompletedGoals(goals.filter(g => g.progress === 100));
    const history: Goal[] = JSON.parse(localStorage.getItem('gb_history') || '[]');
    setDeletedGoals(history.filter(g => g.type === 'deleted'));
  }, []);

  const restoreCompleted = (goal: Goal) => {
    const goals: Goal[] = JSON.parse(localStorage.getItem('gb_goals') || '[]');
    const updated = goals.map(g => g.id === goal.id ? { ...g, progress: 50 } : g);
    localStorage.setItem('gb_goals', JSON.stringify(updated));
    setCompletedGoals(prev => prev.filter(g => g.id !== goal.id));
  };

  const permanentDeleteCompleted = (goal: Goal) => {
    if (!confirm('Permanently delete this goal? This cannot be undone.')) return;
    const goals: Goal[] = JSON.parse(localStorage.getItem('gb_goals') || '[]');
    localStorage.setItem('gb_goals', JSON.stringify(goals.filter(g => g.id !== goal.id)));
    setCompletedGoals(prev => prev.filter(g => g.id !== goal.id));
  };

  const restoreDeleted = (goal: Goal) => {
    const goals: Goal[] = JSON.parse(localStorage.getItem('gb_goals') || '[]');
    const { type, archivedAt, ...cleanGoal } = goal;
    localStorage.setItem('gb_goals', JSON.stringify([...goals, { ...cleanGoal, progress: cleanGoal.progress < 100 ? cleanGoal.progress : 50 }]));
    const history: Goal[] = JSON.parse(localStorage.getItem('gb_history') || '[]');
    localStorage.setItem('gb_history', JSON.stringify(history.filter(g => g.id !== goal.id)));
    setDeletedGoals(prev => prev.filter(g => g.id !== goal.id));
  };

  const permanentDeleteHistory = (goal: Goal) => {
    if (!confirm('Permanently delete this goal? This cannot be undone.')) return;
    const history: Goal[] = JSON.parse(localStorage.getItem('gb_history') || '[]');
    localStorage.setItem('gb_history', JSON.stringify(history.filter(g => g.id !== goal.id)));
    setDeletedGoals(prev => prev.filter(g => g.id !== goal.id));
  };

  const formatDate = (iso: string) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const GoalCard = ({ goal, onRestore, onDelete, restoreLabel }: {
    goal: Goal; onRestore: () => void; onDelete: () => void; restoreLabel: string;
  }) => (
    <div style={{ background: 'white', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f3e8ff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <span style={{ fontSize: '28px' }}>{goal.emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '700', fontSize: '15px', color: '#1f2937' }}>{goal.title}</div>
          <div style={{ fontSize: '12px', color: '#9ca3af' }}>{goal.category}</div>
          {goal.archivedAt && <div style={{ fontSize: '11px', color: '#c4b5fd', marginTop: '2px' }}>Deleted on {formatDate(goal.archivedAt)}</div>}
        </div>
        <span style={{ fontSize: '13px', fontWeight: '700', color: goal.progress === 100 ? '#16a34a' : '#7c3aed' }}>{goal.progress}%</span>
      </div>
      <div style={{ background: '#f3e8ff', borderRadius: '999px', height: '6px', overflow: 'hidden', marginBottom: '12px' }}>
        <div style={{ background: goal.progress === 100 ? 'linear-gradient(90deg,#16a34a,#4ade80)' : 'linear-gradient(90deg,#7c3aed,#a855f7)', width: `${goal.progress}%`, height: '100%', borderRadius: '999px' }} />
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={onRestore}
          style={{ flex: 1, padding: '9px', background: '#f3e8ff', color: '#7c3aed', border: '1.5px solid #c4b5fd', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>
          ↩️ {restoreLabel}
        </button>
        <button onClick={onDelete}
          style={{ flex: 1, padding: '9px', background: 'white', color: '#dc2626', border: '1.5px solid #fca5a5', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>
          🗑️ Delete Forever
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8f4ff', fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', padding: '24px 20px', color: 'white' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', textDecoration: 'none' }}>
            <img src="/logo.svg" alt="GoalBloom" width={30} height={30} style={{ filter: 'brightness(0) invert(1)' }} />
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 'bold', color: 'white' }}>GoalBloom</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => router.push('/')}
              style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '18px' }}>
              ←
            </button>
            <h1 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>📋 History</h1>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>

        {/* Completed Goals */}
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#16a34a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🎉 Completed Goals <span style={{ background: '#f0fdf4', color: '#16a34a', borderRadius: '20px', padding: '2px 10px', fontSize: '13px' }}>{completedGoals.length}</span>
          </h2>
          {completedGoals.length === 0 ? (
            <div style={{ background: 'white', borderRadius: '14px', padding: '24px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
              No completed goals yet. Keep going! 💪
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {completedGoals.map(goal => (
                <GoalCard key={goal.id} goal={goal}
                  onRestore={() => restoreCompleted(goal)}
                  onDelete={() => permanentDeleteCompleted(goal)}
                  restoreLabel="Resume Goal" />
              ))}
            </div>
          )}
        </div>

        {/* Deleted Goals */}
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#dc2626', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🗑️ Deleted Goals <span style={{ background: '#fef2f2', color: '#dc2626', borderRadius: '20px', padding: '2px 10px', fontSize: '13px' }}>{deletedGoals.length}</span>
          </h2>
          {deletedGoals.length === 0 ? (
            <div style={{ background: 'white', borderRadius: '14px', padding: '24px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
              No deleted goals. Nothing lost! ✨
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {deletedGoals.map(goal => (
                <GoalCard key={goal.id} goal={goal}
                  onRestore={() => restoreDeleted(goal)}
                  onDelete={() => permanentDeleteHistory(goal)}
                  restoreLabel="Restore Goal" />
              ))}
            </div>
          )}
        </div>

        <footer style={{ textAlign: 'center', color: '#9ca3af', fontSize: '12px', marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #ede9fe' }}>
          © 2026 GoalBloom · Designed &amp; Built by Mehwish Naeem · All rights reserved
        </footer>
      </div>
    </div>
  );
}