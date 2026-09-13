'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

type Goal = {
  id: string; title: string; category: string; deadline: string;
  progress: number; completed: boolean; emoji: string; notes: string;
  why: string; milestones: { text: string; done: boolean }[];
};

export default function GoalDetail() {
  const router = useRouter();
  const params = useParams();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [notes, setNotes] = useState('');
  const [newMilestone, setNewMilestone] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const goals = JSON.parse(localStorage.getItem('gb_goals') || '[]');
    const found = goals.find((g: Goal) => g.id === params.id);
    if (found) { setGoal(found); setNotes(found.notes || ''); setProgress(found.progress || 0); }
  }, [params.id]);

  const saveGoal = (updated: Goal) => {
    const goals = JSON.parse(localStorage.getItem('gb_goals') || '[]');
    const newGoals = goals.map((g: Goal) => g.id === updated.id ? updated : g);
    localStorage.setItem('gb_goals', JSON.stringify(newGoals));
    setGoal(updated);
  };

  const handleProgressChange = (val: number) => {
    setProgress(val);
    if (goal) saveGoal({ ...goal, progress: val, completed: val === 100 });
  };

  const handleNotesSave = () => {
    if (goal) { saveGoal({ ...goal, notes }); alert('Notes saved! 📝'); }
  };

  const addMilestone = () => {
    if (!newMilestone.trim() || !goal) return;
    const updated = { ...goal, milestones: [...(goal.milestones || []), { text: newMilestone, done: false }] };
    saveGoal(updated); setNewMilestone('');
  };

  const toggleMilestone = (index: number) => {
    if (!goal) return;
    const milestones = [...(goal.milestones || [])];
    milestones[index].done = !milestones[index].done;
    saveGoal({ ...goal, milestones });
  };

  const deleteGoal = () => {
    if (!confirm('Delete this goal? 🗑️')) return;
    const goals = JSON.parse(localStorage.getItem('gb_goals') || '[]');
    localStorage.setItem('gb_goals', JSON.stringify(goals.filter((g: Goal) => g.id !== params.id)));
    router.push('/');
  };

  const daysLeft = goal ? Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / 86400000) : 0;

  if (!goal) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading... 🌸</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f8f4ff', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={() => router.push('/')} style={{ background: 'white', border: 'none', borderRadius: '12px', padding: '10px 14px', cursor: 'pointer', fontSize: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>←</button>
        <button onClick={deleteGoal} style={{ background: '#fee2e2', border: 'none', borderRadius: '12px', padding: '10px 14px', cursor: 'pointer', fontSize: '14px', color: '#dc2626', fontWeight: '600' }}>🗑️ Delete</button>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', borderRadius: '20px', padding: '24px', color: 'white', marginBottom: '16px' }}>
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>{goal.emoji}</div>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '4px' }}>{goal.title}</h1>
        <p style={{ opacity: 0.8, fontSize: '14px' }}>{goal.category}</p>
        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '20px', fontSize: '13px' }}>📅 Due {goal.deadline}</span>
          <span style={{ background: daysLeft < 7 ? '#fca5a5' : 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '20px', fontSize: '13px' }}>
            ⏳ {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue!'}
          </span>
        </div>
        {goal.why && <p style={{ marginTop: '12px', opacity: 0.85, fontSize: '13px', fontStyle: 'italic' }}>💭 "{goal.why}"</p>}
      </div>

      {/* Progress */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontWeight: '700', marginBottom: '12px', color: '#1f2937' }}>Progress 📈</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>Completion</span>
          <span style={{ fontWeight: '700', color: '#7c3aed', fontSize: '18px' }}>{progress}%</span>
        </div>
        <div style={{ background: '#e5e7eb', borderRadius: '999px', height: '12px', marginBottom: '12px' }}>
          <div style={{ background: 'linear-gradient(90deg, #7c3aed, #4f46e5)', height: '12px', borderRadius: '999px', width: `${progress}%`, transition: 'width 0.3s' }} />
        </div>
        <input type="range" min="0" max="100" value={progress} onChange={e => handleProgressChange(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#7c3aed' }} />
        {progress === 100 && <p style={{ textAlign: 'center', color: '#10b981', fontWeight: '700', marginTop: '8px' }}>🎉 Goal Completed! Amazing!</p>}
      </div>

      {/* Milestones */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontWeight: '700', marginBottom: '12px', color: '#1f2937' }}>Milestones ✅</h2>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <input type="text" placeholder="Add a milestone..." value={newMilestone} onChange={e => setNewMilestone(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addMilestone()}
            style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '2px solid #e5e7eb', outline: 'none', fontSize: '14px' }} />
          <button onClick={addMilestone} style={{ background: '#7c3aed', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 16px', cursor: 'pointer', fontWeight: '600' }}>+</button>
        </div>
        {(goal.milestones || []).length === 0 ? (
          <p style={{ color: '#9ca3af', fontSize: '14px', textAlign: 'center' }}>No milestones yet — add your first step! 🪜</p>
        ) : (
          (goal.milestones || []).map((m, i) => (
            <div key={i} onClick={() => toggleMilestone(i)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '10px', background: m.done ? '#f0fdf4' : '#fafafa', marginBottom: '8px', cursor: 'pointer' }}>
              <span style={{ fontSize: '18px' }}>{m.done ? '✅' : '⬜'}</span>
              <span style={{ fontSize: '14px', color: m.done ? '#6b7280' : '#1f2937', textDecoration: m.done ? 'line-through' : 'none' }}>{m.text}</span>
            </div>
          ))
        )}
      </div>

      {/* Notes */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontWeight: '700', marginBottom: '12px', color: '#1f2937' }}>My Notes 📝</h2>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={5} placeholder="Write your thoughts, plans, reflections..."
          style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #e5e7eb', fontSize: '14px', outline: 'none', resize: 'none' }} />
        <button onClick={handleNotesSave}
          style={{ marginTop: '8px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 20px', cursor: 'pointer', fontWeight: '600' }}>
          Save Notes 💾
        </button>
      </div>

      <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '12px', marginTop: '8px' }}>Built by Mehwish © 2026</p>
    </div>
  );
}