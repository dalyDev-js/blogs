// src/components/Header.js
import { useState } from "react";
import SearchBar from "./SearchBar";
import "../styles/Header.css";

const Header = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    onSearch(newQuery);
  };

  return (
    <header className="header">
      <div className="purple-line-top"></div>
      <div className="purple-line-bottom"></div>
      <p className="badge">Our blog</p>
      <h1 className="title">Resources and insights</h1>
      <p className="description">
        The latest industry news, interviews, technologies, and resources.
      </p>
      <SearchBar query={query} onInputChange={handleInputChange} />
    </header>
  );
};

export default Header;
