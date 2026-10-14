function CategoryFilter({
  categories,
  category,
  onCategoryChange,
}) {
  return (
    <select
      className="control"
      value={category}
      onChange={(e) => onCategoryChange(e.target.value)}
      aria-label="Filtruj po kategorii"
    >
      <option value="">Wszystkie kategorie</option>

      {categories.map((item) => {
        const value = typeof item === "string" ? item : item.slug;
        const label = typeof item === "string" ? item : item.name;

        return (
          <option key={value} value={value}>
            {label}
          </option>
        );
      })}
    </select>
  );
}

export default CategoryFilter;