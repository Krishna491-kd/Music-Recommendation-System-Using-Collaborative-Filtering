import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler

class MusicRecommender:
    def __init__(self, data_path='SpotifyFeatures.csv'):
        # Load data, drop exact duplicates to keep data clean
        try:
            self.df = pd.read_csv(data_path)
        except FileNotFoundError:
            # Fallback gracefully if they renamed it back to spotify.csv
            self.df = pd.read_csv('spotify.csv')
            
        if 'track_id' in self.df.columns:
            self.df = self.df.drop_duplicates(subset=['track_id']).reset_index(drop=True)
            
        self.feature_matrix = None
        self._prepare_data()
        
    def _prepare_data(self):
        # Select numeric audio features (handle both old synthetic and new real dataset)
        available_features = []
        for feat in ['energy', 'valence', 'danceability', 'tempo', 'acousticness', 'loudness', 'liveness']:
            if feat in self.df.columns:
                available_features.append(feat)
                
        numeric_features = self.df[available_features]
        
        # One-hot encode the genre. We multiply by a weight so genre heavily influences the cosine angle
        genre_encoded = pd.get_dummies(self.df['genre']) * 1.5 
        
        # Combine features
        features = pd.concat([numeric_features, genre_encoded], axis=1)
        
        # Scale features so that audio features have balanced impact
        scaler = StandardScaler()
        self.feature_matrix = scaler.fit_transform(features)
        
        # We DO NOT precompute the N x N similarity matrix.
        # For 230,000+ tracks, an N x N matrix takes 300+ GB of RAM and crashes immediately.
        # We will compute 1 x N similarity on the fly in the recommend() method perfectly fast.
        
    def get_popular_songs(self, limit=5000):
        # To prevent the Streamlit browser UI from crashing trying to load 230,000 dropdown items,
        # we only offer the top 5000 most popular songs in the dropdown menu.
        if 'popularity' in self.df.columns:
            return self.df.sort_values(by='popularity', ascending=False)['track_name'].drop_duplicates().head(limit).tolist()
        return self.df['track_name'].drop_duplicates().head(limit).tolist()
        
    def recommend(self, song_name, num_recs=5):
        # Find the index of the song
        idx_list = self.df[self.df['track_name'].str.lower() == song_name.lower()].index.tolist()
        
        if not idx_list:
            return None # Song not found
            
        # Get the first match
        song_idx = idx_list[0]
        
        # Get the feature vector for this song (1 x Features)
        song_vector = self.feature_matrix[song_idx].reshape(1, -1)
        
        # Compute similarity of this song against ALL other songs (1 x N array)
        sim_scores = cosine_similarity(song_vector, self.feature_matrix).flatten()
        
        # Get indices of top similar songs (excluding the song itself)
        # argsort() sorts ascending, so we take the end and reverse it
        top_indices = sim_scores.argsort()[-(num_recs+1):][::-1]
        
        # Remove the song itself from the list and limit to desired number
        top_indices = [i for i in top_indices if i != song_idx][:num_recs]
        
        # Identify columns to return
        cols_to_return = ['track_name', 'artist_name', 'genre']
        if 'track_id' in self.df.columns:
            cols_to_return.append('track_id')
            
        return self.df.iloc[top_indices][cols_to_return]

# Quick test if run directly
if __name__ == "__main__":
    recommender = MusicRecommender()
    print("Dataset loaded! Shape:", recommender.df.shape)
    songs = recommender.get_popular_songs(10)
    print("Popular songs:", songs)
    if songs:
        print("\nTest Recommendations for:", songs[0])
        print(recommender.recommend(songs[0], 3).to_string(index=False))
