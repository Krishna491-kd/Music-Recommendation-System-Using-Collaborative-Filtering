export interface Song {
  id: string | number;
  title: string;
  artist: string;
  genre: string;
  mood: string;
  image: string;
  duration: number; // seconds
}

export const songs: Song[] = [
  { id: 1, title: "Tum Hi Ho", artist: "Arijit Singh", genre: "Romantic", mood: "Sad", image: "https://picsum.photos/seed/song1/300/300", duration: 262 },
  { id: 2, title: "Humdard", artist: "Arijit Singh", genre: "Romantic", mood: "Sad", image: "https://picsum.photos/seed/song2/300/300", duration: 240 },
  { id: 3, title: "Channa Mereya", artist: "Arijit Singh", genre: "Romantic", mood: "Sad", image: "https://picsum.photos/seed/song3/300/300", duration: 289 },
  { id: 4, title: "Agar Tum Saath Ho", artist: "Arijit Singh", genre: "Romantic", mood: "Melancholy", image: "https://picsum.photos/seed/song4/300/300", duration: 332 },
  { id: 5, title: "Raabta", artist: "Arijit Singh", genre: "Romantic", mood: "Happy", image: "https://picsum.photos/seed/song5/300/300", duration: 225 },
  { id: 6, title: "Kun Faya Kun", artist: "A.R. Rahman", genre: "Sufi", mood: "Peaceful", image: "https://picsum.photos/seed/song6/300/300", duration: 458 },
  { id: 7, title: "Jai Ho", artist: "A.R. Rahman", genre: "Pop", mood: "Happy", image: "https://picsum.photos/seed/song7/300/300", duration: 320 },
  { id: 8, title: "Tere Bina", artist: "A.R. Rahman", genre: "Romantic", mood: "Sad", image: "https://picsum.photos/seed/song8/300/300", duration: 295 },
  { id: 9, title: "Dil Se Re", artist: "A.R. Rahman", genre: "Romantic", mood: "Passionate", image: "https://picsum.photos/seed/song9/300/300", duration: 358 },
  { id: 10, title: "Chaiyya Chaiyya", artist: "Sukhwinder Singh", genre: "Folk", mood: "Happy", image: "https://picsum.photos/seed/song10/300/300", duration: 396 },
  { id: 11, title: "Gallan Goodiyaan", artist: "Sukhwinder Singh", genre: "Pop", mood: "Happy", image: "https://picsum.photos/seed/song11/300/300", duration: 274 },
  { id: 12, title: "Kesariya", artist: "Arijit Singh", genre: "Romantic", mood: "Happy", image: "https://picsum.photos/seed/song12/300/300", duration: 268 },
  { id: 13, title: "Bulleya", artist: "Amit Mishra", genre: "Sufi", mood: "Passionate", image: "https://picsum.photos/seed/song13/300/300", duration: 285 },
  { id: 14, title: "Ilahi", artist: "Arijit Singh", genre: "Pop", mood: "Happy", image: "https://picsum.photos/seed/song14/300/300", duration: 218 },
  { id: 15, title: "Khairiyat", artist: "Arijit Singh", genre: "Romantic", mood: "Sad", image: "https://picsum.photos/seed/song15/300/300", duration: 290 },
  { id: 16, title: "Mast Magan", artist: "Arijit Singh", genre: "Romantic", mood: "Melancholy", image: "https://picsum.photos/seed/song16/300/300", duration: 305 },
  { id: 17, title: "Ae Dil Hai Mushkil", artist: "Arijit Singh", genre: "Romantic", mood: "Sad", image: "https://picsum.photos/seed/song17/300/300", duration: 275 },
  { id: 18, title: "Rang De Basanti", artist: "Daler Mehndi", genre: "Patriotic", mood: "Passionate", image: "https://picsum.photos/seed/song18/300/300", duration: 340 },
];

export function getRecommendations(currentSong: Song): Song[] {
  const others = songs.filter((s) => s.id !== currentSong.id);

  const scored = others.map((s) => {
    let score = 0;
    if (s.artist === currentSong.artist) score += 3;
    if (s.genre === currentSong.genre) score += 2;
    if (s.mood === currentSong.mood) score += 1;
    return { song: s, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((s) => s.song);
}
