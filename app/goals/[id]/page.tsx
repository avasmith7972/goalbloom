'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Milestone { text: string; done: boolean; }
interface Goal {
  id: string; title: string; emoji: string; category: string;
  deadline: string; why: string; progress: number;
  milestones: Milestone[]; notes: string; priority: string;
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

function Confetti({ show }: { show: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!show) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const pieces: { x:number; y:number; r:number; color:string; speed:number; angle:number; spin:number }[] = [];
    const colors = ['#7c3aed','#a855f7','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444'];
    for (let i = 0; i < 150; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 3 + 2,
        angle: Math.random() * 360,
        spin: Math.random() * 4 - 2,
      });
    }
    let frame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.y += p.speed;
        p.angle += p.spin;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.angle * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.5);
        ctx.restore();
      });
      if (pieces.some(p => p.y < canvas.height)) {
        frame = requestAnimationFrame(animate);
      }
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [show]);

  if (!show) return null;
  return (
    <canvas ref={canvasRef}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }} />
  );
}

export default function GoalDetail() {
  const router = useRouter();
  const params = useParams();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [newMilestone, setNewMilestone] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);
  const prevProgress = useRef(0);

  useEffect(() => {
    const goals: Goal[] = JSON.parse(localStorage.getItem('gb_goals') || '[]');
    const found = goals.find(g => g.id === params.id);
    if (found) {
      setGoal(found);
      prevProgress.current = found.progress;
    }
  }, [params.id]);

  const save = (updated: Goal) => {
    const goals: Goal[] = JSON.parse(localStorage.getItem('gb_goals') || '[]');
    const newGoals = goals.map(g => g.id === updated.id ? updated : g);
    localStorage.setItem('gb_goals', JSON.stringify(newGoals));
    setGoal(updated);
  };

  const handleProgress = (val: number) => {
    if (!goal) return;
    const updated = { ...goal, progress: val };
    save(updated);
    if (val === 100 && prevProgress.current < 100) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
    prevProgress.current = val;
  };

  const addMilestone = () => {
    if (!goal || !newMilestone.trim()) return;
    const updated = { ...goal, milestones: [...goal.milestones, { text: newMilestone.trim(), done: false }] };
    save(updated);
    setNewMilestone('');
  };

  const toggleMilestone = (index: number) => {
    if (!goal) return;
    const milestones = goal.milestones.map((m, i) => i === index ? { ...m, done: !m.done } : m);
    save({ ...goal, milestones });
  };

  const deleteMilestone = (index: number) => {
    if (!goal) return;
    const milestones = goal.milestones.filter((_, i) => i !== index);
    save({ ...goal, milestones });
  };

  const saveNotes = () => {
    if (!goal) return;
    save(goal);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  const deleteGoal = () => {
    if (!confirm('Delete this goal? It will be saved in History.')) return;
    const goals: Goal[] = JSON.parse(localStorage.getItem('gb_goals') || '[]');
    localStorage.setItem('gb_goals', JSON.stringify(goals.filter(g => g.id !== goal?.id)));
    const history = JSON.parse(localStorage.getItem('gb_history') || '[]');
    history.unshift({ ...goal, type: 'deleted', archivedAt: new Date().toISOString() });
    localStorage.setItem('gb_history', JSON.stringify(history));
    router.push('/');
  };

  if (!goal) return <div style={{ padding: '40px', textAlign: 'center', color: '#7c3aed' }}>Loading...</div>;

  const countdown = getCountdown(goal.deadline);
  const doneCount = goal.milestones.filter(m => m.done).length;

  return (
    <div style={{ minHeight: '100vh', background: '#f8f4ff', fontFamily: 'system-ui, sans-serif' }}>
      <Confetti show={showConfetti} />

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', padding: '24px 20px', color: 'white' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', textDecoration: 'none' }}>
            <img src="/logo.svg" alt="GoalBloom" width={30} height={30} style={{ filter: 'brightness(0) invert(1)' }} />
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 'bold', color: 'white' }}>GoalBloom</span>
          </Link>
          <button onClick={() => router.push('/')}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '18px', marginBottom: '16px' }}>
            ←
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '48px' }}>{goal.emoji}</span>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 4px' }}>{goal.title}</h1>
              <div style={{ fontSize: '13px', opacity: 0.85 }}>{goal.category}</div>
              {goal.deadline && (
                <div style={{ fontSize: '13px', marginTop: '4px', fontWeight: '600',
                  color: countdown.includes('Overdue') ? '#fca5a5' : countdown.includes('today') || countdown.includes('1 day') ? '#fde68a' : 'rgba(255,255,255,0.9)' }}>
                  {countdown}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>

        {goal.progress === 100 && (
          <div style={{ background: 'linear-gradient(135deg, #16a34a, #4ade80)', borderRadius: '14px', padding: '16px', marginBottom: '16px', textAlign: 'center', color: 'white', fontWeight: '700', fontSize: '16px' }}>
            🎉 Goal Completed! You did it!
          </div>
        )}

        {/* Progress */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontWeight: '700', color: '#1f2937' }}>Progress</span>
            <span style={{ fontWeight: '800', fontSize: '20px', color: goal.progress === 100 ? '#16a34a' : '#7c3aed' }}>{goal.progress}%</span>
          </div>
          <div style={{ background: '#e5e7eb', borderRadius: '999px', height: '12px', overflow: 'hidden', marginBottom: '12px' }}>
            <div style={{ background: goal.progress === 100 ? 'linear-gradient(90deg,#16a34a,#4ade80)' : 'linear-gradient(90deg,#7c3aed,#a855f7)', width: `${goal.progress}%`, height: '100%', borderRadius: '999px', transition: 'width 0.3s' }} />
          </div>
          <input type="range" min={0} max={100} value={goal.progress}
            onChange={e => handleProgress(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#7c3aed', cursor: 'pointer' }} />
        </div>

        {/* Milestones */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontWeight: '700', color: '#1f2937', fontSize: '16px' }}>✅ Milestones</span>
            <span style={{ fontSize: '12px', color: '#7c3aed', fontWeight: '600' }}>{doneCount}/{goal.milestones.length} done</span>
          </div>
          {goal.milestones.length === 0 && (
            <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '14px', fontStyle: 'italic' }}>No milestones yet. Add one below!</p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
            {goal.milestones.map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: m.done ? '#f0fdf4' : '#fafafa', borderRadius: '10px', border: `1px solid ${m.done ? '#bbf7d0' : '#e5e7eb'}` }}>
                <input type="checkbox" checked={m.done} onChange={() => toggleMilestone(i)}
                  style={{ width: '18px', height: '18px', accentColor: '#7c3aed', cursor: 'pointer', flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: '14px', color: m.done ? '#6b7280' : '#1f2937', textDecoration: m.done ? 'line-through' : 'none' }}>{m.text}</span>
                <button onClick={() => deleteMilestone(i)}
                  style={{ background: 'none', border: 'none', color: '#d1d5db', cursor: 'pointer', fontSize: '16px', padding: '0 2px', lineHeight: 1 }}>×</button>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input value={newMilestone} onChange={e => setNewMilestone(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addMilestone()}
              placeholder="Add a milestone..."
              style={{ flex: 1, padding: '10px 12px', borderRadius: '10px', border: '2px solid #e9d5ff', fontSize: '14px', outline: 'none', fontFamily: 'system-ui, sans-serif' }} />
            <button onClick={addMilestone}
              style={{ background: '#7c3aed', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 16px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>
              + Add
            </button>
          </div>
        </div>

        {/* Notes */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <span style={{ fontWeight: '700', color: '#1f2937', fontSize: '16px', display: 'block', marginBottom: '12px' }}>📝 Journal & Notes</span>
          <textarea value={goal.notes} onChange={e => setGoal({ ...goal, notes: e.target.value })}
            placeholder="Write your thoughts, reflections, or anything about this goal..."
            rows={5}
            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #e9d5ff', fontSize: '14px', outline: 'none', resize: 'vertical', fontFamily: 'system-ui, sans-serif', lineHeight: '1.6', boxSizing: 'border-box' }} />
          <button onClick={saveNotes}
            style={{ marginTop: '10px', background: noteSaved ? '#16a34a' : '#7c3aed', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 20px', fontWeight: '600', cursor: 'pointer', fontSize: '14px', transition: 'background 0.2s' }}>
            {noteSaved ? '✓ Saved!' : 'Save Notes'}
          </button>
        </div>

        {/* Why */}
        {goal.why && (
          <div style={{ background: '#faf5ff', borderRadius: '16px', padding: '16px 20px', marginBottom: '16px', border: '1px solid #e9d5ff' }}>
            <span style={{ fontWeight: '700', color: '#7c3aed', fontSize: '13px', display: 'block', marginBottom: '6px' }}>💭 WHY THIS MATTERS</span>
            <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>{goal.why}</p>
          </div>
        )}

        {/* Delete */}
        <button onClick={deleteGoal}
          style={{ width: '100%', padding: '14px', background: 'white', border: '2px solid #fca5a5', borderRadius: '14px', color: '#dc2626', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>
          🗑️ Delete Goal
        </button>

        <footer style={{ textAlign: 'center', color: '#9ca3af', fontSize: '12px', marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #ede9fe' }}>
          © 2026 GoalBloom · Designed &amp; Built by Mehwish Naeem · All rights reserved
        </footer>
      </div>
    </div>
  );
}