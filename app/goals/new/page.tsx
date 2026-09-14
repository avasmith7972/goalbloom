'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const emojis = ['🎯','💪','📚','💰','🏃','🎨','✈️','🧘','💻','🎵','🌱','⭐'];
const categories = ['Health & Fitness','Career & Study','Finance & Savings','Creativity & Art','Travel & Adventure','Relationships','Personal Growth','Hobbies & Fun'];

export default function NewGoal() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('🎯');
  const [category, setCategory] = useState('');
  const [deadline, setDeadline] = useState('');
  const [why, setWhy] = useState('');
  const [priority, setPriority] = useState('Medium');

  const handleSubmit = () => {
    if (!title.trim()) return alert('Please enter a goal title!');
    const existing = JSON.parse(localStorage.getItem('gb_goals') || '[]');
    const newGoal = {
      id: Date.now().toString(),
      title: title.trim(),
      emoji, category, deadline, why,
      priority,
      progress: 0,
      milestones: [],
      notes: '',
    };
    localStorage.setItem('gb_goals', JSON.stringify([...existing, newGoal]));
    router.push('/');
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: '12px',
    border: '2px solid #e9d5ff', fontSize: '15px', outline: 'none',
    fontFamily: 'system-ui, sans-serif', boxSizing: 'border-box' as const,
    background: 'white',
  };

  const priorityOptions = [
    { value: 'High',   label: '🔴 High',   color: '#c0392b', bg: '#fdecea', border: '#c0392b' },
    { value: 'Medium', label: '🟡 Medium', color: '#d68910', bg: '#fef9e7', border: '#d68910' },
    { value: 'Low',    label: '🟢 Low',    color: '#1e8449', bg: '#eafaf1', border: '#1e8449' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8f4ff', fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', padding: '24px 20px', color: 'white' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>

          {/* Logo row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <img src="/logo.svg" alt="GoalBloom" width={30} height={30} style={{ filter: 'brightness(0) invert(1)' }} />
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 'bold', color: 'white' }}>
              GoalBloom
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => router.push('/')}
              style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '18px' }}>
              ←
            </button>
            <h1 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>🌱 New Goal</h1>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 20px' }}>

        {/* Emoji picker */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '10px' }}>Pick an Emoji 🎨</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {emojis.map(e => (
              <button key={e} onClick={() => setEmoji(e)}
                style={{ fontSize: '24px', padding: '8px', borderRadius: '10px', border: emoji === e ? '2px solid #7c3aed' : '2px solid transparent', background: emoji === e ? '#f3e8ff' : 'white', cursor: 'pointer' }}>
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Goal Title ✏️</label>
          <input value={title} onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Run a 5K race" style={inputStyle} />
        </div>

        {/* Priority */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '10px' }}>Priority Level 🚦</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            {priorityOptions.map(p => (
              <button key={p.value} onClick={() => setPriority(p.value)}
                style={{
                  flex: 1, padding: '10px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '13px',
                  border: priority === p.value ? `2px solid ${p.border}` : '2px solid #e5e7eb',
                  background: priority === p.value ? p.bg : 'white',
                  color: priority === p.value ? p.color : '#6b7280',
                  transition: 'all 0.15s',
                }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '10px' }}>Category 📂</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                style={{ padding: '8px 14px', borderRadius: '20px', border: category === cat ? '2px solid #7c3aed' : '2px solid #e9d5ff', background: category === cat ? '#7c3aed' : 'white', color: category === cat ? 'white' : '#6b7280', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Deadline */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Deadline 📅</label>
          <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} style={inputStyle} />
        </div>

        {/* Why */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Why does this matter? 💭</label>
          <textarea value={why} onChange={e => setWhy(e.target.value)}
            placeholder="This goal matters to me because..."
            rows={3}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.5' }} />
        </div>

        {/* Submit */}
        <button onClick={handleSubmit}
          style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white', border: 'none', borderRadius: '14px', fontSize: '17px', fontWeight: '700', cursor: 'pointer' }}>
          🌸 Plant This Goal
        </button>

        {/* Copyright footer */}
        <footer style={{ textAlign: 'center', color: '#9ca3af', fontSize: '12px', marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #ede9fe' }}>
          © 2026 GoalBloom · Designed &amp; Built by Mehwish Naeem · All rights reserved
        </footer>

      </div>
    </div>
  );
}