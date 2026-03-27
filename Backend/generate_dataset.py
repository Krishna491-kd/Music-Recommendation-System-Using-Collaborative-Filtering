import pandas as pd
import numpy as np

data = {
    'track_name': ['Blinding Lights', 'Shape of You', 'Dance Monkey', 'Rockstar', 'Someone You Loved', 
                   'Lose Yourself', 'Stronger', 'Eye of the Tiger', 'Till I Collapse', 'Remember The Name',
                   'Perfect', 'All of Me', 'Thinking Out Loud', 'A Thousand Years', 'Photograph',
                   'Bohemian Rhapsody', 'Hotel California', 'Stairway to Heaven', 'Sweet Child O Mine', 'Smells Like Teen Spirit',
                   'Uptown Funk', 'Happy', 'Cant Stop the Feeling', 'Sugar', 'Shake It Off'],
    'artist_name': ['The Weeknd', 'Ed Sheeran', 'Tones And I', 'Post Malone', 'Lewis Capaldi',
                    'Eminem', 'Kanye West', 'Survivor', 'Eminem', 'Fort Minor',
                    'Ed Sheeran', 'John Legend', 'Ed Sheeran', 'Christina Perri', 'Ed Sheeran',
                    'Queen', 'Eagles', 'Led Zeppelin', 'Guns N Roses', 'Nirvana',
                    'Mark Ronson', 'Pharrell Williams', 'Justin Timberlake', 'Maroon 5', 'Taylor Swift'],
    'genre': ['Pop', 'Pop', 'Pop', 'Hip-Hop', 'Pop',
              'Hip-Hop', 'Hip-Hop', 'Rock', 'Hip-Hop', 'Hip-Hop',
              'Pop', 'R&B', 'Pop', 'Pop', 'Pop',
              'Rock', 'Rock', 'Rock', 'Rock', 'Rock',
              'Pop', 'Pop', 'Pop', 'Pop', 'Pop'],
    'energy': [0.73, 0.65, 0.59, 0.52, 0.41,
               0.74, 0.87, 0.86, 0.85, 0.83,
               0.29, 0.26, 0.45, 0.32, 0.38,
               0.40, 0.55, 0.30, 0.87, 0.91,
               0.61, 0.70, 0.83, 0.79, 0.80],
    'valence': [0.33, 0.93, 0.51, 0.13, 0.45,
                0.06, 0.49, 0.54, 0.10, 0.50,
                0.17, 0.33, 0.59, 0.16, 0.20,
                0.23, 0.50, 0.22, 0.51, 0.73,
                0.93, 0.96, 0.70, 0.88, 0.94],
    'danceability': [0.51, 0.83, 0.82, 0.59, 0.50,
                     0.69, 0.55, 0.60, 0.55, 0.69,
                     0.60, 0.42, 0.78, 0.42, 0.61,
                     0.41, 0.58, 0.34, 0.45, 0.50,
                     0.86, 0.65, 0.67, 0.75, 0.65]
}

df = pd.DataFrame(data)
df.to_csv('spotify.csv', index=False)
print("Generated prototype dataset spotify.csv successfully!")
