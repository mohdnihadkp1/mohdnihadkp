"use client";

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useMusicStore } from '../store/musicStore';
import styles from './AudioPlayer.module.css';
import { Play, Pause, SkipBack, SkipForward, ChevronDown, ListMusic, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AudioPlayer() {
  const audioRef = useRef(null);
  const { songs, currentSongIndex, isPlaying, volume, isPlayerVisible, setIsPlaying, setCurrentSongIndex, nextSong, prevSong, setVolume, closePlayer } = useMusicStore();
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const currentSong = songs[currentSongIndex];

  // Generate a deterministic gradient color based on the song title
  const themeColors = useMemo(() => {
    if (!currentSong) return { from: '#450af5', to: '#c4efd9' };
    let hash = 0;
    for (let i = 0; i < currentSong.title.length; i++) {
      hash = currentSong.title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color1 = `hsl(${Math.abs(hash) % 360}, 80%, 50%)`;
    const color2 = `hsl(${(Math.abs(hash) + 60) % 360}, 80%, 30%)`;
    return { from: color1, to: color2 };
  }, [currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            if (e.name !== 'AbortError') {
              console.warn("Audio play failed:", e);
            }
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSongIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle smooth crossfade-like pause/play on volume change (Optional advanced feature)
  // For now, standard fast response is preferred.

  const togglePlay = (e) => {
    if(e) e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressChange = (e) => {
    if(e) e.stopPropagation();
    const value = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setProgress(value);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleError = (e) => {
    console.warn("Audio playback error: Source may be unsupported or blocked.", e);
    setIsPlaying(false);
  };

  const handleContainerClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  if (!currentSong || !isPlayerVisible) return null;

  let audioSrc = currentSong.link;
  try {
    const urlObj = new URL(currentSong.link);
    const id = urlObj.searchParams.get('id');
    if (id) {
      audioSrc = `/api/audio?id=${id}`;
    }
  } catch (err) {
    // Fallback
  }

  // Next 5 songs for the Queue View
  const queueSongs = [];
  for(let i=1; i<=5; i++) {
    queueSongs.push(songs[(currentSongIndex + i) % songs.length]);
  }

  return (
    <>
      <audio 
        ref={audioRef} 
        src={audioSrc} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextSong}
        onLoadedMetadata={handleTimeUpdate}
        onError={handleError}
      />
      
      <AnimatePresence>
        {isPlayerVisible && (
          <motion.div 
            layout
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            className={`${styles.playerWrapper} ${isExpanded ? styles.expandedPlayer : styles.miniPlayer}`}
            onClick={handleContainerClick}
          >
            {/* Dynamic Background Glow in Expanded Mode */}
            {isExpanded && (
              <div 
                className={styles.expandedBgGlow} 
                style={{ background: `radial-gradient(circle, ${themeColors.from} 0%, transparent 70%)` }} 
              />
            )}

            {/* MINI PLAYER VIEW */}
            {!isExpanded && (
              <>
                <div 
                  className={styles.miniArtwork} 
                  style={{ background: `linear-gradient(135deg, ${themeColors.from}, ${themeColors.to})` }}
                />
                <div className={styles.miniDetails}>
                  <div className={styles.miniTitle}>{currentSong.title}</div>
                  <div className={styles.miniArtist}>{currentSong.artist}</div>
                </div>
                
                {isPlaying && (
                  <div className={styles.visualizer}>
                    {[1, 2, 3].map(i => <div key={i} className={`${styles.bar} ${styles.animating}`} />)}
                  </div>
                )}
                
                <div className={styles.miniControls}>
                  <button className={styles.iconBtn} onClick={(e) => { e.stopPropagation(); prevSong(); }}><SkipBack size={20} /></button>
                  <button className={styles.miniPlayBtn} onClick={togglePlay}>
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" style={{marginLeft: '2px'}} />}
                  </button>
                  <button className={styles.iconBtn} onClick={(e) => { e.stopPropagation(); nextSong(); }}><SkipForward size={20} /></button>
                  <button className={styles.iconBtn} onClick={(e) => { e.stopPropagation(); closePlayer(); }}><X size={20} /></button>
                </div>
              </>
            )}

            {/* EXPANDED PLAYER VIEW */}
            {isExpanded && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.1 }}
                className={styles.noPropagate}
                style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                {/* Top Nav */}
                <div className={styles.topNav}>
                  <button 
                    className={styles.closeButton} 
                    onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                  >
                    <ChevronDown size={28} />
                  </button>
                  <span className={styles.nowPlayingText}>Now Playing</span>
                  <div style={{ width: '48px' }}></div> {/* Spacer */}
                </div>

                {/* Main Content */}
                <div className={styles.expandedContent}>
                  {/* Artwork / Vinyl */}
                  <div className={styles.artworkContainer}>
                    <div 
                      className={`${styles.vinylDisc} ${isPlaying ? styles.vinylSpin : styles.vinylPaused}`}
                      style={{ background: `linear-gradient(135deg, ${themeColors.from}, ${themeColors.to})` }}
                    />
                  </div>

                  {/* Details */}
                  <div className={styles.songDetails}>
                    <div className={styles.songTitle}>{currentSong.title}</div>
                    <div className={styles.songArtist}>{currentSong.artist}</div>
                  </div>

                  {/* Progress Bar */}
                  <div className={styles.progressWrapper}>
                    <input 
                      type="range" 
                      min={0} 
                      max={duration || 100} 
                      value={progress} 
                      onChange={handleProgressChange}
                      className={styles.progressBar}
                      style={{ '--progress': `${(progress / (duration || 1)) * 100}%` }}
                    />
                    <div className={styles.timeDisplay}>
                      <span>{formatTime(progress)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Main Controls */}
                  <div className={styles.mainControls}>
                    <button className={styles.iconBtn} onClick={(e) => { e.stopPropagation(); prevSong(); }}>
                      <SkipBack size={32} fill="currentColor" />
                    </button>
                    <button className={styles.playPauseBtn} onClick={togglePlay}>
                      {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" style={{marginLeft: '4px'}} />}
                    </button>
                    <button className={styles.iconBtn} onClick={(e) => { e.stopPropagation(); nextSong(); }}>
                      <SkipForward size={32} fill="currentColor" />
                    </button>
                  </div>
                </div>

                {/* Queue Section */}
                <div className={styles.queueSection}>
                  <div className={styles.queueHeader}>
                    <ListMusic size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
                    Up Next
                  </div>
                  <div className={styles.queueList}>
                    {queueSongs.map((song, idx) => {
                      const actualIndex = (currentSongIndex + idx + 1) % songs.length;
                      return (
                        <div 
                          key={`${song.id}-${idx}`} 
                          className={styles.queueItem}
                          onClick={() => {
                            setCurrentSongIndex(actualIndex);
                          }}
                        >
                          <div className={styles.queueIndex}>{idx + 1}</div>
                          <div className={styles.queueDetails}>
                            <div className={styles.queueTitle}>{song.title}</div>
                            <div className={styles.queueArtist}>{song.artist}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

              </motion.div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
