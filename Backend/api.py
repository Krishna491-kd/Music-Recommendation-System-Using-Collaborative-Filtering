from flask import Flask, request, jsonify
from flask_cors import CORS
from recommender import MusicRecommender
import os

app = Flask(__name__)
# Allow CORS so the React app running on a different port can fetch data
CORS(app) 

print("Initializing AI Recommender Engine in background...")
recommender = MusicRecommender()
print("Recommender system ready to serve requests!")

def format_song(row):
    """Map the SpotifyFeatures.csv row to the Frontend's Song interface."""
    return {
        "id": str(row.get('track_id', str(row.name))),
        "title": str(row['track_name']),
        "artist": str(row['artist_name']),
        "genre": str(row['genre']),
        "mood": "Atmospheric", # Mock mood since the dataset doesn't have an exact mood column
        "image": f"https://picsum.photos/seed/{row.get('track_id', row.name)}/300/300", 
        "duration": int(row.get('duration_ms', 200000) / 1000)
    }

@app.route('/api/songs', methods=['GET'])
def get_songs():
    """Return top popular songs for the homepage."""
    try:
        limit = int(request.args.get('limit', 24))
        
        if 'popularity' in recommender.df.columns:
            popular_df = recommender.df.sort_values(by='popularity', ascending=False).head(limit)
        else:
            popular_df = recommender.df.head(limit)
            
        songs = [format_song(row) for _, row in popular_df.iterrows()]
        return jsonify(songs)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/search', methods=['GET'])
def search_songs():
    query = request.args.get('q', '').lower()
    if not query:
        return jsonify([])
    
    # Filter by title, artist, or genre
    mask = (
        recommender.df['track_name'].str.lower().str.contains(query, na=False) |
        recommender.df['artist_name'].str.lower().str.contains(query, na=False) |
        recommender.df['genre'].str.lower().str.contains(query, na=False)
    )
    
    results_df = recommender.df[mask].head(120)
    songs = [format_song(row) for _, row in results_df.iterrows()]
    return jsonify(songs)

@app.route('/api/songs_by_ids', methods=['POST'])
def songs_by_ids():
    data = request.json
    ids = data.get('ids', [])
    if not ids:
        return jsonify([])
        
    mask = recommender.df['track_id'].isin(ids)
    # also handle if they pass the index
    mask = mask | recommender.df.index.astype(str).isin([str(i) for i in ids])
    
    results_df = recommender.df[mask]
    songs = [format_song(row) for _, row in results_df.iterrows()]
    return jsonify(songs)

@app.route('/api/recommendations', methods=['GET'])
def get_recommendations():
    """Given a song_title, calculate and return recommendations."""
    song_name = request.args.get('song_title')
    num_recs = int(request.args.get('num_recs', 6))
    
    if not song_name:
        return jsonify({"error": "song_title parameter is required"}), 400
        
    try:
        recommendations_df = recommender.recommend(song_name, num_recs=num_recs)
        
        if recommendations_df is None or len(recommendations_df) == 0:
            return jsonify([]) # Return empty array if no recommendations found
            
        songs = [format_song(row) for _, row in recommendations_df.iterrows()]
        return jsonify(songs)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Allow overriding the port for local environments where 5000 is unavailable.
    port = int(os.environ.get("PORT", "5000"))
    app.run(port=port, debug=False)
