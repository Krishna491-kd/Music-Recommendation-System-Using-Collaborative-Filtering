import { useState, useEffect } from "react";
import { SongCard } from "@/components/SongCard";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Song } from "@/data/songs";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    
    const timeoutId = setTimeout(() => {
      setIsLoading(true);
      fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          setResults(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error(err);
          setIsLoading(false);
        });
    }, 300); // debounce API calls
    
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="flex flex-col min-h-screen p-6 pb-24 space-y-6">
      <div className="relative w-full max-w-lg">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do you want to listen to?"
          className="pl-9 bg-secondary border-0 h-11 text-base"
          autoFocus
        />
      </div>

      {query && isLoading && <p className="text-muted-foreground">Searching catalog...</p>}
      
      {query && !isLoading && results.length === 0 && (
        <p className="text-muted-foreground">No results found for "{query}"</p>
      )}

      {!query && (
        <div>
          <h2 className="text-xl font-bold mb-4">Browse by Genre</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {["Romantic", "Sufi", "Pop", "Folk", "Patriotic", "Hip-Hop", "Rock"].map((genre) => (
              <button
                key={genre}
                onClick={() => setQuery(genre)}
                className="rounded-lg bg-accent p-6 text-left font-semibold text-foreground hover:bg-accent/80 transition-colors"
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {results.map((song) => (
            <SongCard key={song.id} song={song} queue={results} />
          ))}
        </div>
      )}
    </div>
  );
}
