import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { Song } from "@/data/songs";

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  shuffle: boolean;
  repeat: boolean;
  likedSongs: (string | number)[];
  currentQueue: Song[];
  playSong: (song: Song, queue?: Song[]) => void;
  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  seek: (value: number) => void;
  setVolume: (value: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleLike: (id: string | number) => void;
}

const PlayerContext = createContext<PlayerState | null>(null);

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolumeState] = useState(70);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [likedSongs, setLikedSongs] = useState<(string | number)[]>([]);
  const [currentQueue, setCurrentQueue] = useState<Song[]>([]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize the real HTML5 audio element
  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;
    
    const updateProgress = () => {
      setProgress(audio.currentTime);
    };
    
    const handleEnded = () => {
      // Loop or stop when the 30-second preview finishes
      if (audioRef.current) {
          audioRef.current.currentTime = 0;
          setProgress(0);
          setIsPlaying(false);
          // Dispatch a custom event so the nextSong hook can catch it reliably
          window.dispatchEvent(new Event("songEnded"));
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);
    
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
  }, []);

  // Sync volume changes to the audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Handle playSong -> fetch iTunes preview
  const playSong = useCallback(async (song: Song, queue: Song[] = []) => {
    if (queue.length > 0) {
        setCurrentQueue(queue);
    }
    
    setCurrentSong(song);
    setProgress(0);
    setIsPlaying(false); 
    
    if (audioRef.current) {
        audioRef.current.pause();
    }
    
    // Fetch a real playable URL from iTunes based on the song data from our AI Engine
    try {
        const query = encodeURIComponent(`${song.title} ${song.artist}`);
        const res = await fetch(`https://itunes.apple.com/search?term=${query}&media=music&limit=1`);
        const data = await res.json();
        
        if (data.results && data.results.length > 0 && data.results[0].previewUrl) {
            if (audioRef.current) {
                audioRef.current.src = data.results[0].previewUrl;
                audioRef.current.play()
                  .then(() => setIsPlaying(true))
                  .catch(e => console.error(e));
                
                // iTunes previews are exactly 30 seconds
                song.duration = 30; 
            }
        } else {
            console.error("No mp3 preview available for this track.");
            setIsPlaying(false);
        }
    } catch(err) {
        console.error("Failed to fetch audio preview", err);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !currentSong) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => console.error(e));
    }
  }, [isPlaying, currentSong]);

  const getNextIndex = useCallback(() => {
    if (!currentSong || currentQueue.length === 0) return -1;
    const idx = currentQueue.findIndex((s) => s.id === currentSong.id);
    if (idx === -1) return -1;
    if (shuffle) return Math.floor(Math.random() * currentQueue.length);
    if (repeat) return idx;
    return (idx + 1) % currentQueue.length;
  }, [currentSong, currentQueue, shuffle, repeat]);

  const nextSong = useCallback(() => {
    const idx = getNextIndex();
    if (idx !== -1 && currentQueue[idx]) {
      playSong(currentQueue[idx], currentQueue);
    }
  }, [getNextIndex, playSong, currentQueue]);

  const prevSong = useCallback(() => {
    if (!currentSong || currentQueue.length === 0) return;
    const idx = currentQueue.findIndex((s) => s.id === currentSong.id);
    if (idx === -1) return;
    const prev = (idx - 1 + currentQueue.length) % currentQueue.length;
    playSong(currentQueue[prev], currentQueue);
  }, [currentSong, currentQueue, playSong]);

  // Handle auto-next using the custom event from the audio element
  useEffect(() => {
    const handleSongEnded = () => {
      nextSong();
    };
    window.addEventListener("songEnded", handleSongEnded);
    return () => window.removeEventListener("songEnded", handleSongEnded);
  }, [nextSong]);

  const seek = useCallback((value: number) => {
    setProgress(value);
    if (audioRef.current) {
        audioRef.current.currentTime = value;
    }
  }, []);
  
  const setVolume = useCallback((value: number) => setVolumeState(value), []);
  const toggleShuffle = useCallback(() => setShuffle((s) => !s), []);
  const toggleRepeat = useCallback(() => setRepeat((r) => !r), []);
  
  const toggleLike = useCallback((id: string | number) => {
    setLikedSongs((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  }, []);

  return (
    <PlayerContext.Provider value={{
      currentSong, isPlaying, progress, volume, shuffle, repeat, likedSongs, currentQueue,
      playSong, togglePlay, nextSong, prevSong, seek, setVolume, toggleShuffle, toggleRepeat, toggleLike,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}
