function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-image">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
        />

        <span className="product-rating">
          ★ {product.rating?.toFixed(1) ?? "—"}
        </span>
      </div>

      <div className="product-info">
        <span className="category-tag">
          {product.category.replaceAll("-", " ")}
        </span>

        <h3 title={product.title}>{product.title}</h3>

        <div className="product-bottom">
          <div className="price">
            {product.price.toLocaleString("pl-PL", {
              style: "currency",
              currency: "USD",
            })}
          </div>

          <span className="product-arrow" aria-hidden="true">
            ↗
          </span>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;