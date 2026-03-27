import {
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat,
  Volume2, VolumeX
} from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { Slider } from "@/components/ui/slider";

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function PlayerBar() {
  const {
    currentSong, isPlaying, progress, volume, shuffle, repeat,
    togglePlay, nextSong, prevSong, seek, setVolume, toggleShuffle, toggleRepeat,
  } = usePlayer();

  if (!currentSong) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center justify-center border-t border-border bg-card/95 backdrop-blur">
        <p className="text-sm text-muted-foreground">Select a song to start playing</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center border-t border-border bg-card/95 backdrop-blur px-4">
      {/* Song info */}
      <div className="flex items-center gap-3 w-[30%] min-w-0">
        <img src={currentSong.image} alt={currentSong.title} className="h-12 w-12 rounded object-cover shrink-0" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{currentSong.title}</p>
          <p className="truncate text-xs text-muted-foreground">{currentSong.artist}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-1 flex-col items-center gap-1">
        <div className="flex items-center gap-4">
          <button onClick={toggleShuffle} className={`transition-colors ${shuffle ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
            <Shuffle className="h-4 w-4" />
          </button>
          <button onClick={prevSong} className="text-muted-foreground hover:text-foreground transition-colors">
            <SkipBack className="h-5 w-5" />
          </button>
          <button onClick={togglePlay} className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background hover:scale-105 transition-transform">
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </button>
          <button onClick={nextSong} className="text-muted-foreground hover:text-foreground transition-colors">
            <SkipForward className="h-5 w-5" />
          </button>
          <button onClick={toggleRepeat} className={`transition-colors ${repeat ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
            <Repeat className="h-4 w-4" />
          </button>
        </div>
        <div className="flex w-full max-w-md items-center gap-2">
          <span className="text-[11px] text-muted-foreground w-10 text-right">{formatTime(progress)}</span>
          <Slider
            value={[progress]}
            max={currentSong.duration}
            step={1}
            onValueChange={([v]) => seek(v)}
            className="flex-1"
          />
          <span className="text-[11px] text-muted-foreground w-10">{formatTime(currentSong.duration)}</span>
        </div>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2 w-[20%] justify-end">
        <button onClick={() => setVolume(volume === 0 ? 70 : 0)} className="text-muted-foreground hover:text-foreground transition-colors">
          {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
        <Slider
          value={[volume]}
          max={100}
          step={1}
          onValueChange={([v]) => setVolume(v)}
          className="w-24"
        />
      </div>
    </div>
  );
}
