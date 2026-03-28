import { useState, useEffect } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { SongCard } from "@/components/SongCard";
import { RecommendationList } from "@/components/RecommendationList";
import { NowPlayingCard } from "@/components/NowPlayingCard";
import { Navbar } from "@/components/Navbar";
import { Song } from "@/data/songs";
import { API_BASE_URL } from "@/lib/api";

export default function Home() {
  const { currentSong } = usePlayer();
  const [searchQuery, setSearchQuery] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [recommendations, setRecommendations] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch catalog or global search results
  useEffect(() => {
    setIsLoading(true);
    
    if (!searchQuery) {
        // Load default popular catalog
        fetch(`${API_BASE_URL}/api/songs?limit=60`)
          .then((res) => res.json())
          .then((data) => {
            setSongs(data);
            setIsLoading(false);
          })
          .catch((err) => {
            console.error("Failed to fetch songs", err);
            setIsLoading(false);
          });
          return;
    }
    
    // Perform dynamic global search on the backend across 230k tracks
    const timeoutId = setTimeout(() => {
        fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(searchQuery)}`)
          .then((res) => res.json())
          .then((data) => {
            setSongs(data);
            setIsLoading(false);
          })
          .catch((err) => {
            console.error("Failed to fetch search results", err);
            setIsLoading(false);
          });
    }, 300); // 300ms debounce
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Fetch recommendations when current song changes
  useEffect(() => {
    if (currentSong) {
      fetch(`${API_BASE_URL}/api/recommendations?song_title=${encodeURIComponent(currentSong.title)}&num_recs=8`)
        .then((res) => res.json())
        .then((data) => setRecommendations(data))
        .catch((err) => console.error("Failed to fetch recommendations", err));
    } else {
      setRecommendations([]);
    }
  }, [currentSong]);

  // Use the fetched songs directly since the API does the filtering globally now
  const filteredSongs = songs;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div className="flex-1 overflow-y-auto p-6 pb-24 space-y-8">
        {currentSong && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
            <div className="space-y-8">
              {recommendations.length > 0 && <RecommendationList songs={recommendations} />}
            </div>
            <div className="hidden lg:block">
              <h2 className="mb-4 text-xl font-bold text-foreground">Now Playing</h2>
              <NowPlayingCard />
            </div>
          </div>
        )}

        <section>
          <h2 className="mb-4 text-xl font-bold text-foreground">
            {searchQuery ? "Search Results" : "Top Popular Songs"}
          </h2>
          {isLoading ? (
            <p className="text-muted-foreground">Loading dataset from AI Engine...</p>
          ) : filteredSongs.length === 0 ? (
            <p className="text-muted-foreground">No songs found.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {filteredSongs.map((song) => (
                <SongCard key={song.id} song={song} queue={filteredSongs} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
