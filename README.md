# 🎵 AI Music Recommendation System

A state-of-the-art **Content-Based Music Recommendation Engine** built as a mini-project for the Recommender Systems (RS) course. The project seamlessly integrates a heavy-duty Machine Learning backend with a premium, interactive React user interface.

## ✨ Features

- **Massive Scale**: Dynamically searches and computes recommendations across a massive **230,000+ Spotify track catalog** in milliseconds.
- **Content-Based Filtering**: Uses **Cosine Similarity** to mathematically compare tracks based on their multi-dimensional audio features (`energy`, `valence`, `danceability`, `tempo`, `acousticness`, `loudness`, `liveness`) and weighted `genre` encodings.
- **Live Audio Subsystem**: Fully functional, custom-built music player UI that pings the public **iTunes Search API** to dynamically stream **30-second high-quality Mp3 previews** of the recommended songs.
- **Premium Interface**: A localized, dark-mode React application featuring glassmorphism elements, micro-animations, and a highly responsive layout.

## 🛠️ Technology Stack

**Backend (AI Engine)**
- **Python**: Core logic.
- **Pandas & NumPy**: For efficient 200k+ row data matrix manipulation.
- **Scikit-Learn**: Mathematical Cosine Similarity vectors.
- **Flask & Flask-CORS**: Highly-scalable REST API framework serving the React frontend.

**Frontend (User Interface)**
- **React 18 & Vite**: Lightning-fast web rendering.
- **TypeScript**: Strictly typed application architecture.
- **Tailwind CSS**: Modern utility-first styling.
- **Lucide-React**: Clean, elegant iconography.

---

## 🚀 How to Run Locally

### The Easy Way (Windows)
1. Clone the repository.
2. Double-click the **`run.bat`** file located in the root directory.
3. This script will automatically initialize the Python Backend API and start the React Frontend servers simultaneously in their own windows!
4. Wait 5-10 seconds, then open **http://localhost:5173** in your browser.

### The Manual Way
If you prefer to start the servers manually:

**1. Start the AI Backend API**
```bash
cd Backend
# Activate your virtual environment (e.g., .\venv\Scripts\Activate or source venv/bin/activate)
python api.py
```
*(The backend runs on `http://127.0.0.1:5000`)*

**2. Start the React Frontend**
Open a **second** terminal and run:
```bash
cd Frontend
npm install
npm run dev
```
*(The UI runs on `http://localhost:5173`)*

---

## 📚 Dataset Information
The system computes recommendations using `SpotifyFeatures.csv`, a 33MB compilation containing 232,000+ tracks mapped dynamically by standard audio profiles. Recommendations are heavily swayed by genre alignment and energy proximity.

---
*Developed for the Recommender Systems (RS) Mini-Project.*
