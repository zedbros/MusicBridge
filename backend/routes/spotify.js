const axios = require("axios");

let cachedToken = null;
let tokenExpiry = 0;

// Client Credentials flow — no user login needed for search
async function getSpotifyToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const credentials = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const res = await axios.post(
    "https://accounts.spotify.com/api/token",
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  cachedToken = res.data.access_token;
  tokenExpiry = Date.now() + res.data.expires_in * 1000 - 60000; // refresh 1min early
  return cachedToken;
}

async function searchSpotify(query) {
  const token = await getSpotifyToken();
  const res = await axios.get("https://api.spotify.com/v1/search", {
    headers: { Authorization: `Bearer ${token}` },
    params: { q: query, type: "track", limit: 5 },
  });

  const tracks = res.data.tracks.items;
  if (!tracks.length) return null;

  const track = tracks[0];
  return {
    name: track.name,
    artist: track.artists.map(a => a.name).join(", "),
    album: track.album.name,
    duration: track.duration_ms,
    cover: track.album.images[0]?.url,
    spotifyId: track.id,
  };
}

module.exports = { searchSpotify };
