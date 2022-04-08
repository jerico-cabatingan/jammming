import React from 'react';
import './SearchBar.css';

export const SearchBar = (props) => {
  const handleChange = ({ target }) => {
    props.onSearch(target.value);
  }

  return (
    <div className="SearchBar">
      <input placeholder="Enter A Song, Album, or Artist" onChange={handleChange}/>
      <button className="SearchButton">SEARCH</button>
    </div>
  );
}
