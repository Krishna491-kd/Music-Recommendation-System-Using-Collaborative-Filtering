import { Play, Pause } from "lucide-react";
import { Song } from "@/data/songs";
import { usePlayer } from "@/context/PlayerContext";

interface SongCardProps {
  song: Song;
  queue?: Song[];
}

export function SongCard({ song, queue = [] }: SongCardProps) {
  const { playSong, currentSong, isPlaying, togglePlay } = usePlayer();
  const isActive = currentSong?.id === song.id;

  const handleClick = () => {
    if (isActive) {
      togglePlay();
    } else {
      playSong(song, queue);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`group relative flex flex-col gap-3 rounded-lg bg-card p-4 transition-all duration-200 hover:bg-accent text-left w-full ${
        isActive ? "ring-1 ring-primary" : ""
      }`}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-md">
        <img
          src={song.image}
          alt={song.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
            {isActive && isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </div>
        </div>
      </div>
      <div className="min-w-0">
        <p className={`truncate text-sm font-semibold ${isActive ? "text-primary" : "text-foreground"}`}>
          {song.title}
        </p>
        <p className="truncate text-xs text-muted-foreground">{song.artist}</p>
      </div>
    </button>
  );
}
