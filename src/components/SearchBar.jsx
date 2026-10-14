function SearchBar({ search, onSearch }) {
  return (
    <label className="search-box">
      <span className="search-icon" aria-hidden="true">⌕</span>

      <input
        type="search"
        placeholder="Szukaj produktu..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        aria-label="Wyszukaj produkt po nazwie"
      />
    </label>
  );
}

export default SearchBar;