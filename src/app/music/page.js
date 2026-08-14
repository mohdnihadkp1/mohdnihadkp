import React from 'react';
import MusicClient from './MusicClient';
import { songs } from '@/data/songs';

export async function generateMetadata({ searchParams }) {
  const resolvedParams = await searchParams;
  const songId = resolvedParams?.song;
  
  const defaultTitle = 'Vibes & Vision | NKP Audio';
  const defaultDescription = 'An ultra-premium, handpicked collection of tracks.';
  
  if (songId) {
    const song = songs.find(s => s.id.toString() === songId);
    if (song) {
      return {
        title: `${song.title} - ${song.artist} | NKP Audio`,
        description: `Listen to ${song.title} by ${song.artist}. Mood: ${song.mood}.`,
        openGraph: {
          title: `${song.title} - ${song.artist}`,
          description: `Listen to ${song.title} by ${song.artist}. Mood: ${song.mood}.`,
          // We don't have unique album art for each song right now, so we fall back to the global logo 
          // or you could add a default music thumbnail here
        }
      };
    }
  }

  return {
    title: defaultTitle,
    description: defaultDescription,
  };
}

export default async function MusicPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const initialSongId = resolvedParams?.song || null;

  return <MusicClient initialSongId={initialSongId} />;
}
