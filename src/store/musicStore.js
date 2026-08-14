import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { songs } from '../data/songs';

export const useMusicStore = create(
  persist(
    (set) => ({
      songs: songs,
      currentSongIndex: 0,
      isPlaying: false,
      isPlayerVisible: false,
      volume: 1,
      
      setCurrentSongIndex: (index) => set({ currentSongIndex: index, isPlayerVisible: true }),
      setIsPlaying: (playing) => set((state) => ({ 
        isPlaying: playing, 
        isPlayerVisible: playing ? true : state.isPlayerVisible 
      })),
      setVolume: (volume) => set({ volume }),
      closePlayer: () => set({ isPlayerVisible: false, isPlaying: false }),
      
      nextSong: () => set((state) => ({
        currentSongIndex: (state.currentSongIndex + 1) % state.songs.length,
        isPlayerVisible: true
      })),
      
      prevSong: () => set((state) => ({
        currentSongIndex: (state.currentSongIndex - 1 + state.songs.length) % state.songs.length,
        isPlayerVisible: true
      }))
    }),
    {
      name: 'music-player-storage',
      partialize: (state) => ({
        currentSongIndex: state.currentSongIndex,
        volume: state.volume,
        // We don't persist `isPlaying` so it doesn't automatically start blasting music on reload
      }),
    }
  )
);
