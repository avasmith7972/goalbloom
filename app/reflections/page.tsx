'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Reflections() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);
  const [lastSaved, setLastSaved] = useState('');
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('gb_reflections');
    if (saved) {
      const data = JSON.parse(saved);
      setText(data.text || '');
      setLastSaved(data.savedAt || '');
      setWordCount((data.text || '').trim().split(/\s+/).filter(Boolean).length);
    }
  }, []);

  const handleChange = (val: string) => {
    setText(val);
    setWordCount(val.trim().split(/\s+/).filter(Boolean).length);
  };

  const handleSave = () => {
    const now = new Date().toISOString();
    localStorage.setItem('gb_reflections', JSON.stringify({ text, savedAt: now }));
    setLastSaved(now);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const formatSaved = (iso: string) => {
    if (!iso) return '';
    return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #fdf8ff 0%, #f3e8ff 50%, #fdf4ff 100%)', fontFamily: 'system-ui, sans-serif' }}>

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
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 2px' }}>🪞 Self-Reflections</h1>
              <p style={{ fontSize: '13px', opacity: 0.85, margin: 0 }}>Your private space to think freely</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '28px 20px' }}>

        {/* Notepad */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(124,58,237,0.12), 0 2px 8px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          border: '1px solid #e9d5ff',
        }}>

          {/* Notepad top bar */}
          <div style={{
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>✏️</span>
              <span style={{ color: 'white', fontFamily: 'Georgia, serif', fontSize: '15px', fontWeight: '600' }}>My Reflections</span>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
              {wordCount > 0 ? `${wordCount} word${wordCount !== 1 ? 's' : ''}` : 'Start writing...'}
            </span>
          </div>

          {/* Red margin line */}
          <div style={{ display: 'flex', minHeight: '420px' }}>
            <div style={{ width: '40px', background: '#fff5f5', borderRight: '2px solid #fca5a5', flexShrink: 0 }} />

            {/* Lined paper area */}
            <div style={{
              flex: 1,
              backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #e9d5ff 31px, #e9d5ff 32px)',
              backgroundSize: '100% 32px',
              backgroundPositionY: '8px',
            }}>
              <textarea
                value={text}
                onChange={e => handleChange(e.target.value)}
                placeholder="Write freely... what's on your mind today? What are you proud of? What do you want to improve? There are no rules here. 🌸"
                style={{
                  width: '100%',
                  minHeight: '420px',
                  padding: '12px 16px',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '15px',
                  lineHeight: '32px',
                  fontFamily: 'Georgia, serif',
                  color: '#1f2937',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{
            borderTop: '1px solid #f3e8ff',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#faf5ff',
          }}>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>
              {lastSaved ? `Last saved ${formatSaved(lastSaved)}` : 'Not saved yet'}
            </span>
            <button onClick={handleSave}
              style={{
                background: saved ? '#16a34a' : 'linear-gradient(135deg, #7c3aed, #a855f7)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 22px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'background 0.2s',
              }}>
              {saved ? '✓ Saved!' : '💾 Save'}
            </button>
          </div>
        </div>

        {/* Gentle prompt */}
        <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.7)', borderRadius: '14px', padding: '16px 20px', border: '1px solid #e9d5ff' }}>
          <p style={{ margin: 0, fontSize: '13px', color: '#7c3aed', fontStyle: 'italic', lineHeight: '1.7', fontFamily: 'Georgia, serif' }}>
            💭 <strong>Prompts to get you started:</strong> What did I accomplish this week? What challenged me? What am I grateful for? What do I want to focus on next?
          </p>
        </div>

        <footer style={{ textAlign: 'center', color: '#9ca3af', fontSize: '12px', marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #ede9fe' }}>
          © 2026 GoalBloom · Designed &amp; Built by Mehwish Naeem · All rights reserved
        </footer>
      </div>
    </div>
  );
}