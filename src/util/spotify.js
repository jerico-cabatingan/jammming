let accessToken; 
const clientID = '52f72ea259f24e02b76d021e46e67646';
const redirectURI = 'https://stately-lokum-680275.netlify.app';

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    let accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    let expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);

      window.setTimeout(() => accessTokenMatch = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;

    } else {
      const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
      window.location = accessURL;
    }
  },

  async search(searchTerm) {
    const newToken = Spotify.getAccessToken()

    const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
      headers: { Authorization: `Bearer ${newToken}` }
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      const tracksArray = jsonResponse.tracks.items.map(track => ({
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        id: track.id,
        uri: track.uri
      }));
      return tracksArray;
    } else {
      return [];
    }
  },

  async savePlayist(playlistName, trackURIs) {
    if (!playlistName || !trackURIs) {
      return;
    }

    const newToken = Spotify.getAccessToken();
    const header = { Authorization: `Bearer ${newToken}` };
    let userID;

    const getUser = await fetch('https://api.spotify.com/v1/me', { headers: header });
    const user = await getUser.json();
    userID = user.id

    const createPlaylist = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
      headers: header,
      method: 'POST',
      body: JSON.stringify({ name: playlistName })
    });
    const newPlaylist = await createPlaylist.json();
    const playlistID = newPlaylist.id

    const addTracksToPlaylist = async () => {
      await fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
      headers: header,
      method: 'POST',
      body: JSON.stringify({ uris: trackURIs })
      })
    }
    addTracksToPlaylist()
  }
}

export default Spotify;
