import urllib.request
import os

# A few known public URLs for Spotify datasets with audio features
urls = [
    "https://raw.githubusercontent.com/rfordantas/recommendation-system-spotify/master/data/data.csv",
    "https://raw.githubusercontent.com/edyoda/data-science-complete-tutorial/master/Data/spotify.csv",
    "https://raw.githubusercontent.com/mahdiasadzadeh/Music-Recommendation-System/main/dataset/spotify.csv"
]

file_name = "spotify.csv"

for url in urls:
    try:
        print(f"Trying to download from {url}")
        urllib.request.urlretrieve(url, file_name)
        # Check if file has reasonable size
        if os.path.getsize(file_name) > 10000:
            print(f"Successfully downloaded dataset from {url}")
            break
        else:
            print("File too small, might be an error page.")
    except Exception as e:
        print(f"Failed to download from {url}: {e}")
