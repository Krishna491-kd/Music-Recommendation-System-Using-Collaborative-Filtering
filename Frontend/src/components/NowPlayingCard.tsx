import { usePlayer } from "@/context/PlayerContext";
import { Heart } from "lucide-react";

export function NowPlayingCard() {
  const { currentSong, isPlaying, progress, likedSongs, toggleLike } = usePlayer();

  if (!currentSong) return null;

  const liked = likedSongs.includes(currentSong.id);
  const pct = currentSong.duration > 0 ? (progress / currentSong.duration) * 100 : 0;

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl bg-card p-6">
      <div className="relative w-full max-w-[240px] overflow-hidden rounded-lg shadow-lg">
        <img
          src={currentSong.image}
          alt={currentSong.title}
          className={`w-full aspect-square object-cover ${isPlaying ? "animate-pulse" : ""}`}
        />
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-foreground">{currentSong.title}</p>
          <p className="truncate text-sm text-muted-foreground">{currentSong.artist}</p>
        </div>
        <button onClick={() => toggleLike(currentSong.id)} className="shrink-0 ml-2">
          <Heart className={`h-5 w-5 transition-colors ${liked ? "fill-primary text-primary" : "text-muted-foreground hover:text-foreground"}`} />
        </button>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full bg-primary transition-all duration-1000" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
