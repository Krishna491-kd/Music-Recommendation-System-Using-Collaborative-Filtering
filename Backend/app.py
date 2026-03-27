import streamlit as st
import pandas as pd
from recommender import MusicRecommender

# Set page config
st.set_page_config(page_title="MusicSense Recommender", page_icon="🎵", layout="centered")

# Custom CSS for Premium Look
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
    
    html, body, [class*="css"]  {
        font-family: 'Inter', sans-serif;
    }
    
    .stApp {
        background: linear-gradient(135deg, #09090b 0%, #171717 100%);
        color: #ffffff;
    }
    
    h1, h2, h3 {
        color: #1DB954 !important; /* Spotify Green */
        font-weight: 700;
        letter-spacing: -0.5px;
    }
    
    .song-card {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 20px;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    .song-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 15px 30px rgba(29, 185, 84, 0.15);
        border-color: rgba(29, 185, 84, 0.4);
        background: rgba(255, 255, 255, 0.05);
    }
    
    .track-title {
        font-size: 1.4rem;
        font-weight: bold;
        color: #ffffff;
        margin-bottom: 6px;
    }
    
    .track-artist {
        font-size: 1rem;
        color: #a3a3a3;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .track-genre {
        display: inline-block;
        background: linear-gradient(90deg, #1DB954 0%, #1ed760 100%);
        color: #000;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 700;
        margin-top: 16px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 12px;
    }
    
    div.stButton > button {
        background: linear-gradient(90deg, #1DB954 0%, #1ed760 100%);
        color: black !important;
        border: none;
        border-radius: 30px;
        font-weight: 700;
        padding: 0.75rem 2.5rem;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(29, 185, 84, 0.3);
    }
    
    div.stButton > button:hover {
        transform: scale(1.03);
        box-shadow: 0 8px 25px rgba(29, 185, 84, 0.5);
    }
    
</style>
""", unsafe_allow_html=True)

# App Header
st.title("🎵 MusicSense AI")
st.markdown("<p style='font-size: 1.1rem; color: #a3a3a3; margin-bottom: 2rem;'>Discover your next favorite track. Our algorithm analyzes the <b>energy, vibe, and genre</b> of the music you listen to, and recommends tracks with the exact same feel.</p>", unsafe_allow_html=True)

st.markdown("---")

# Load recommender
@st.cache_resource(show_spinner=False)
def load_recommender():
    return MusicRecommender()

try:
    with st.spinner("Loading dataset into memory (this happens only once)..."):
        recommender = load_recommender()
        song_list = recommender.get_popular_songs(limit=7000) # Limit dropdown size to keep UI fast
except Exception as e:
    st.error(f"Error loading model: {e}")
    st.stop()

# User Inputs
st.subheader("What are you listening to right now?")
col1, col2 = st.columns([3, 1])
with col1:
    selected_song = st.selectbox("Search for a song...", song_list, label_visibility="collapsed")
with col2:
    num_recs = st.slider("Recommendations", min_value=1, max_value=10, value=5, label_visibility="collapsed")

st.write("") # Spacing

# Recommendation Logic
if st.button("Generate Recommendations", use_container_width=True):
    with st.spinner('Analyzing audio features in multi-dimensional space...'):
        recommendations = recommender.recommend(selected_song, num_recs=num_recs)
        
        st.write("") 
        st.markdown("### 🎧 You might also like:")
        st.write("")
        
        if recommendations is not None:
            for index, row in recommendations.iterrows():
                
                # Setup Spotify Playback widget if track_id exists
                track_id = row.get('track_id', None)
                spotify_iframe = ""
                if track_id:
                    spotify_iframe = f"""
                    <iframe src="https://open.spotify.com/embed/track/{track_id}" 
                    width="100%" height="80" frameborder="0" allowtransparency="true" 
                    allow="encrypted-media" style="border-radius: 12px; margin-top: 10px;"></iframe>
                    """

                st.markdown(f"""
                <div class="song-card">
                    <div class="track-title">{row['track_name']}</div>
                    <div class="track-artist">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        {row['artist_name']}
                    </div>
                    <div class="track-genre">{row['genre']}</div>
                    <br>
                    {spotify_iframe}
                </div>
                """, unsafe_allow_html=True)
        else:
            st.warning("Song not found in the dataset.")
            
st.markdown("---")
st.caption("Powered by Content-Based Filtering & Cosine Similarity • Developed for RS Mini Project")
