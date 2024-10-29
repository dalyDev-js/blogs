import "../styles/SearchBar.css";
const SearchBar = ({ query, onInputChange }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={onInputChange}
        placeholder="Search"
      />
    </div>
  );
};

export default SearchBar;
