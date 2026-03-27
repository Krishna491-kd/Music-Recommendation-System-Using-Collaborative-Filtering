import { useState, useEffect } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { SongCard } from "@/components/SongCard";
import { Heart } from "lucide-react";
import { Song } from "@/data/songs";

export default function Library() {
  const { likedSongs } = usePlayer();
  const [liked, setLiked] = useState<Song[]>([]);

  useEffect(() => {
    if (likedSongs.length === 0) {
      setLiked([]);
      return;
    }
    
    fetch("http://localhost:5000/api/songs_by_ids", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: likedSongs })
    })
      .then(res => res.json())
      .then(data => setLiked(data))
      .catch(err => console.error(err));
      
  }, [likedSongs]);

  return (
    <div className="flex flex-col min-h-screen p-6 pb-24 space-y-6">
      <div className="flex items-center gap-3">
        <Heart className="h-6 w-6 text-primary fill-primary" />
        <h1 className="text-2xl font-bold">Liked Songs</h1>
      </div>

      {liked.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Heart className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg">Songs you like will appear here</p>
          <p className="text-muted-foreground text-sm mt-1">Save songs by tapping the heart icon</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {liked.map((song) => (
            <SongCard key={song.id} song={song} queue={liked} />
          ))}
        </div>
      )}
    </div>
  );
}
