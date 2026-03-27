import { Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function Navbar({ searchQuery, onSearchChange }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-4 border-b border-border bg-background/80 backdrop-blur px-6">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search songs, artists..."
          className="pl-9 bg-secondary border-0 h-9 text-sm"
        />
      </div>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
        <User className="h-4 w-4 text-muted-foreground" />
      </div>
    </header>
  );
}
