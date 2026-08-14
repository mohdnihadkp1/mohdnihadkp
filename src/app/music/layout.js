import React from 'react';

export const metadata = {
  title: 'Music Library | Mohammed Nihad KP',
  description: 'Spotify clone music player featuring a custom playlist.',
};

export default function MusicLayout({ children }) {
  return (
    <div style={{ paddingBottom: '90px', minHeight: '100vh', color: '#fff' }}>
      {children}
    </div>
  );
}
