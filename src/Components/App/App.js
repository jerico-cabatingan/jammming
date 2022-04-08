import './App.css';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';
import Spotify from '../../util/spotify';
import React from 'react';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      searchResults: [],
      playlistTracks: [],
      playlistName: 'Playlist'
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search =this.search.bind(this);
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return
    } else { 
      tracks.push(track)
      this.setState({ playlistTracks: tracks });
    };
  }


  removeTrack(track) {
    const newPlaylist = this.state.playlistTracks.filter(selectedTrack => selectedTrack.id !== track.id);
    this.setState({ playlistTracks: newPlaylist });
  }

  updatePlaylistName(newName) {
    this.setState({ playlistName: newName })
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri)
    Spotify.savePlayist(this.state.playlistName, trackURIs)
    .then(() => this.setState({
      playlistName: 'New Playlist',
      playlistTracks: []
    }))
  }

  
  search(term) {
    Spotify.search(term).then(results => {
      this.setState({ searchResults: results })
    });
  }
  
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults}    
                           onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName}    
                      playlistTracks={this.state.playlistTracks}
                      onRemove={this.removeTrack} 
                      onChange={this.updatePlaylistName}
                      onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
