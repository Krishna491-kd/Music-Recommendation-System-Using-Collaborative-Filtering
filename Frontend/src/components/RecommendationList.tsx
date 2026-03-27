import { SongCard } from "./SongCard";
import { Song } from "@/data/songs";

interface RecommendationListProps {
  songs: Song[];
}

export function RecommendationList({ songs }: RecommendationListProps) {
  if (songs.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-foreground">Recommended for You</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {songs.map((song) => (
          <SongCard key={song.id} song={song} queue={songs} />
        ))}
      </div>
    </section>
  );
}
