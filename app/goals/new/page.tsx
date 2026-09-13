'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const categories = ['Health & Fitness', 'Career & Study', 'Finance & Savings', 'Creativity & Art', 'Travel & Adventure', 'Relationships', 'Personal Growth', 'Hobbies & Fun'];
const emojis = ['🎯', '💪', '📚', '💰', '✈️', '❤️', '🌱', '🎨', '🏆', '🚀', '⭐', '🔥'];

export default function NewGoal() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [deadline, setDeadline] = useState('');
  const [why, setWhy] = useState('');
  const [emoji, setEmoji] = useState('🎯');

  const handleSave = () => {
    if (!title.trim()) return alert('Please enter a goal title! 🎯');
    if (!category) return alert('Please pick a category! 📂');
    if (!deadline) return alert('Please set a deadline! 📅');

    const goals = JSON.parse(localStorage.getItem('gb_goals') || '[]');
    const newGoal = {
      id: Date.now().toString(),
      title, category, deadline, why, emoji,
      progress: 0,
      completed: false,
      notes: '',
      milestones: [],
      createdAt: new Date().toISOString(),
    };
    goals.push(newGoal);
    localStorage.setItem('gb_goals', JSON.stringify(goals));
    router.push('/');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f4ff', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button onClick={() => router.push('/')} style={{ background: 'white', border: 'none', borderRadius: '12px', padding: '10px 14px', cursor: 'pointer', fontSize: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>←</button>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1f2937' }}>Plant a New Goal 🌱</h1>
      </div>

      <div style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Goal Title 🎯</label>
          <input type="text" placeholder="e.g. Run 5km every morning" value={title} onChange={e => setTitle(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #e5e7eb', fontSize: '15px', outline: 'none' }} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Pick an Emoji 🎭</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {emojis.map(e => (
              <button key={e} onClick={() => setEmoji(e)}
                style={{ fontSize: '22px', padding: '8px', borderRadius: '10px', border: emoji === e ? '2px solid #7c3aed' : '2px solid #e5e7eb', background: emoji === e ? '#f3e8ff' : 'white', cursor: 'pointer' }}>
                {e}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Category 📂</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                style={{ padding: '10px', borderRadius: '10px', border: category === c ? '2px solid #7c3aed' : '2px solid #e5e7eb', background: category === c ? '#f3e8ff' : 'white', cursor: 'pointer', fontSize: '13px', fontWeight: '500', color: category === c ? '#7c3aed' : '#374151' }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Deadline 📅</label>
          <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #e5e7eb', fontSize: '15px', outline: 'none' }} />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Why is this goal important? 💭</label>
          <textarea placeholder="e.g. I want to feel healthier and have more energy..." value={why} onChange={e => setWhy(e.target.value)} rows={3}
            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #e5e7eb', fontSize: '15px', outline: 'none', resize: 'none' }} />
        </div>

        <button onClick={handleSave}
          style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white', border: 'none', borderRadius: '14px', fontSize: '17px', fontWeight: 'bold', cursor: 'pointer' }}>
          Plant This Goal 🌱
        </button>
      </div>

      <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '12px', marginTop: '20px' }}>Built by Mehwish © 2026</p>
    </div>
  );
}