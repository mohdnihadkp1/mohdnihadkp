"use client";

import React, { useState, useEffect } from 'react';
import { useMusicStore } from '@/store/musicStore';
import styles from './page.module.css';
import { Play, Pause, Clock, ArrowLeft, Search, Share2, Check } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function MusicClient({ initialSongId }) {
  const { songs, currentSongIndex, isPlaying, setCurrentSongIndex, setIsPlaying } = useMusicStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Initialize with shared song if present
  useEffect(() => {
    if (initialSongId) {
      const index = songs.findIndex(s => s.id.toString() === initialSongId);
      if (index !== -1) {
        setCurrentSongIndex(index);
        // We do not auto-play here to respect browser auto-play policies, 
        // but it will be selected in the player!
      }
    }
  }, [initialSongId, songs, setCurrentSongIndex]);

  const handlePlaySong = (originalIndex) => {
    const songId = songs[originalIndex].id;
    
    // Update URL without reloading the page
    window.history.pushState({}, '', `/music?song=${songId}`);

    if (currentSongIndex === originalIndex) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSongIndex(originalIndex);
      setIsPlaying(true);
    }
  };

  const handleShare = (e, songId) => {
    e.stopPropagation(); // Prevent playing the song when clicking share
    const url = `${window.location.origin}/music?song=${songId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(songId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter songs based on search query
  const filteredSongs = songs.map((song, index) => ({...song, originalIndex: index})).filter(song => {
    const query = searchQuery.toLowerCase();
    return song.title.toLowerCase().includes(query) || 
           song.artist.toLowerCase().includes(query) ||
           song.mood.toLowerCase().includes(query);
  });

  return (
    <div className={styles.libraryContainer}>
      <header className={styles.header}>
        <div className={styles.topBar}>
          <Link href="/" className={styles.backButton}>
            <ArrowLeft size={24} />
          </Link>
          <div className={styles.userInfo}>NKP Audio</div>
        </div>
        
        <div className={styles.playlistHeader}>
          <div className={styles.playlistInfo}>
            <h1 className={styles.title}>Vibes & Vision.</h1>
            <p className={styles.description}>
              An ultra-premium, handpicked collection of {songs.length} tracks. 
              Tap any song to activate the Liquid Glass player.
            </p>
          </div>
          
          <div className={styles.searchContainer}>
            <div className={styles.searchWrapper}>
              <Search size={20} className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Search by title, artist, or mood..." 
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      <div className={styles.songGrid}>
        {filteredSongs.length === 0 ? (
          <div className={styles.noResults}>No songs found for "{searchQuery}".</div>
        ) : (
          filteredSongs.map((song, i) => {
            const isCurrent = currentSongIndex === song.originalIndex;
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" }}
                key={song.id} 
                className={`${styles.songCard} ${isCurrent ? styles.activeCard : ''}`}
                onClick={() => handlePlaySong(song.originalIndex)}
              >
                <div className={styles.cardArtwork}>
                  {isCurrent && isPlaying ? (
                    <Pause size={24} color="#fff" />
                  ) : (
                    <Play size={24} color="#fff" className={styles.playIcon} />
                  )}
                </div>
                <div className={styles.cardDetails}>
                  <div className={styles.songName}>{song.title}</div>
                  <div className={styles.artistName}>{song.artist} • {song.language}</div>
                </div>
                <div className={styles.cardActions}>
                  <button 
                    className={styles.shareBtn} 
                    onClick={(e) => handleShare(e, song.id)}
                    title="Copy Share Link"
                  >
                    {copiedId === song.id ? <Check size={18} color="#25D366" /> : <Share2 size={18} />}
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
