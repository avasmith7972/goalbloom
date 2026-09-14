'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const avatars = ['🌸', '🦋', '🌟', '🚀', '🎯', '🦁', '🌈', '🎨', '🏆', '🌻', '🐉', '💎'];
const interestOptions = ['Health & Fitness', 'Career & Study', 'Finance & Savings', 'Creativity & Art', 'Travel & Adventure', 'Relationships', 'Personal Growth', 'Hobbies & Fun'];

export default function Onboarding() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🌸');
  const [interests, setInterests] = useState<string[]>([]);

  const toggleInterest = (item: string) => {
    setInterests(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const handleStart = () => {
    if (!name.trim()) return alert('Please enter your name! 😊');
    if (interests.length === 0) return alert('Pick at least one interest! 🎯');
    localStorage.setItem('gb_user', JSON.stringify({ name, avatar, interests }));
    router.push('/');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: 'white', borderRadius: '24px', padding: '40px', maxWidth: '500px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          {/* Custom SVG Logo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <img src="/logo.svg" alt="GoalBloom" width={64} height={64} />
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '26px', fontWeight: 'bold', color: '#4c1d95', letterSpacing: '0.3px' }}>
              GoalBloom
            </span>
          </div>
          <p style={{ color: '#6b7280', marginTop: '4px' }}>Let's set up your personal space 🚀</p>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Your Name ✏️</label>
          <input
            type="text"
            placeholder="e.g. Mehwish"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '2px solid #e5e7eb', fontSize: '16px', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Pick Your Avatar 🎭</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
            {avatars.map(a => (
              <button key={a} onClick={() => setAvatar(a)}
                style={{ fontSize: '24px', padding: '8px', borderRadius: '12px', border: avatar === a ? '3px solid #7c3aed' : '2px solid #e5e7eb', background: avatar === a ? '#f3e8ff' : 'white', cursor: 'pointer' }}>
                {a}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Your Interests 💡</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {interestOptions.map(item => (
              <button key={item} onClick={() => toggleInterest(item)}
                style={{ padding: '10px', borderRadius: '10px', border: interests.includes(item) ? '2px solid #7c3aed' : '2px solid #e5e7eb', background: interests.includes(item) ? '#f3e8ff' : 'white', cursor: 'pointer', fontSize: '13px', fontWeight: '500', color: interests.includes(item) ? '#7c3aed' : '#374151' }}>
                {item}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleStart}
          style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white', border: 'none', borderRadius: '14px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
          Start Blooming 🌸
        </button>

        <footer style={{ textAlign: 'center', color: '#9ca3af', fontSize: '12px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
          © 2026 GoalBloom · Designed &amp; Built by Mehwish Naeem · All rights reserved
        </footer>

      </div>
    </div>
  );
}