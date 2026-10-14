import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ProductsList from "./components/ProductsList";
import SearchBar from "./components/SearchBar";
import CategoryFilter from "./components/CategoryFilter";
import "bootstrap/dist/css/bootstrap.css";

const API_URL = "https://dummyjson.com/products";

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("default");
  const [limit, setLimit] = useState(12);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      setLoading(true);
      setError("");

      try {
        const [productsResponse, categoriesResponse] =
          await Promise.all([
            fetch(`${API_URL}?limit=0`, {
              signal: controller.signal,
            }),
            fetch(`${API_URL}/categories`, {
              signal: controller.signal,
            }),
          ]);

        if (!productsResponse.ok || !categoriesResponse.ok) {
          throw new Error("Nie udało się pobrać danych z API.");
        }

        const productsData = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();

        setProducts(productsData.products);
        setCategories(categoriesData);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Wystąpił nieznany błąd.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => controller.abort();
  }, []);

  const filteredProducts = products
    .filter((product) =>
      product.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter((product) =>
      category ? product.category === category : true
    )
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "name-asc") {
        return a.title.localeCompare(b.title);
      }
      return a.id - b.id;
    });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / limit)
  );

  const currentPage = Math.min(page, totalPages);

  const startIndex = (currentPage - 1) * limit;

  const visibleProducts = filteredProducts.slice(
    startIndex,
    startIndex + limit
  );

  function handleSearch(value) {
    setSearch(value);
    setPage(1);
  }

  function handleCategory(value) {
    setCategory(value);
    setPage(1);
  }

  function handleSort(value) {
    setSort(value);
    setPage(1);
  }

  function handleLimit(value) {
    setLimit(Number(value));
    setPage(1);
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-content">
          <span className="eyebrow">TWÓJ SKLEP ONLINE</span>
          <h1>Znajdź swój produkt<span>.</span></h1>
          <p>
            Odkrywaj produkty, porównuj ceny i wybierz
            coś dla siebie.
          </p>
          <div className="hero-badge">
            ✦ Produkty pobierane z API
          </div>
        </div>
      </header>

      <main className="container">
        <section className="toolbar">
          <div className="toolbar-heading">
            <div>
              <span className="section-label">KOLEKCJA</span>
              <h2>Nasze produkty</h2>
            </div>
            {!loading && !error && (
              <span className="product-count">
                {filteredProducts.length} produktów
              </span>
            )}
          </div>

          <div className="filters">
            <SearchBar
              search={search}
              onSearch={handleSearch}
            />

            <CategoryFilter
              categories={categories}
              category={category}
              onCategoryChange={handleCategory}
            />

            <select
              className="control"
              value={sort}
              onChange={(e) => handleSort(e.target.value)}
              aria-label="Sortowanie produktów"
            >
              <option value="default">Domyślne</option>
              <option value="price-asc">Cena: rosnąco</option>
              <option value="price-desc">Cena: malejąco</option>
              <option value="name-asc">Nazwa: A–Z</option>
            </select>

            <select
              className="control limit-select"
              value={limit}
              onChange={(e) => handleLimit(e.target.value)}
              aria-label="Liczba produktów na stronie"
            >
              <option value={8}>8 na stronę</option>
              <option value={12}>12 na stronę</option>
              <option value={24}>24 na stronę</option>
              <option value={48}>48 na stronę</option>
            </select>
          </div>
        </section>

        {loading && (
          <div className="status" role="status">
            <div className="spinner" />
            <h3>Ładowanie produktów...</h3>
            <p>Chwilka, przygotowujemy ofertę.</p>
          </div>
        )}

        {!loading && error && (
          <div className="status error" role="alert">
            <div className="status-icon">!</div>
            <h3>Coś poszło nie tak</h3>
            <p>{error}</p>
            <button
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              Spróbuj ponownie
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <ProductsList products={visibleProducts} />

            {filteredProducts.length === 0 && (
              <div className="empty-state">
                <span>⌕</span>
                <h3>Nie znaleziono produktów</h3>
                <p>
                  Zmień nazwę produktu lub wybierz inną kategorię.
                </p>
                <button
                  className="retry-button"
                  onClick={() => {
                    setSearch("");
                    setCategory("");
                    setPage(1);
                  }}
                >
                  Wyczyść filtry
                </button>
              </div>
            )}

            {filteredProducts.length > 0 && (
              <nav className="pagination" aria-label="Paginacja">
                <button
                  className="page-button"
                  disabled={currentPage === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ← Poprzednia
                </button>

                <span className="page-info">
                  Strona <strong>{currentPage}</strong> z{" "}
                  <strong>{totalPages}</strong>
                </span>

                <button
                  className="page-button"
                  disabled={currentPage === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Następna →
                </button>
              </nav>
            )}
          </>
        )}
      </main>

      <footer className="footer">
        <p>SKLEP. — Projekt edukacyjny React + DummyJSON API</p>
      </footer>
    </div>
  )
}

export default App
