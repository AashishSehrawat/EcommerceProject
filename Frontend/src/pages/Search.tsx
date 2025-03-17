import ProductCard from "../components/ProductCard";
import macbook from "../assets/Products/macbook.jpg";
import { useState } from "react";

const Search = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const addToCartHandler = () => {};

  const isNextPage = page < 4;
  const isPrevPage = page > 1;

  return (
    <div className="search container">
      <aside>
        <div className="filterSearch">
          <h2>Filter</h2>
          <div className="filteredBySearch">
            <div className="sortFilter">
              <label>Sort</label>
              <select
                name="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="">None</option>
                <option value="asc">Price (Low to High)</option>
                <option value="dsc">Price (High to Low)</option>
              </select>
            </div>
            <div>
              <label>Max Price: {maxPrice || ""}</label>
              <input
                type="range"
                name="price"
                min={100}
                max={100000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Category</label>
              <select
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All</option>
                <option value="">Laptop</option>
                <option value="">Camera</option>
                <option value="">Game</option>
              </select>
            </div>
          </div>
        </div>
      </aside>

      <main>
        <h1>Products</h1>
        <div>
          <div className="searchBar">
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="productSearch">
            <ProductCard
              productId="jfbvad"
              name="Macbook"
              price={80000}
              stock={20}
              photo={macbook}
              handler={addToCartHandler}
            />
            <ProductCard
              productId="jfbvad"
              name="Macbook"
              price={80000}
              stock={20}
              photo={macbook}
              handler={addToCartHandler}
            />
            <ProductCard
              productId="jfbvad"
              name="Macbook"
              price={80000}
              stock={20}
              photo={macbook}
              handler={addToCartHandler}
            />
            <ProductCard
              productId="jfbvad"
              name="Macbook"
              price={80000}
              stock={20}
              photo={macbook}
              handler={addToCartHandler}
            />
            <ProductCard
              productId="jfbvad"
              name="Macbook"
              price={80000}
              stock={20}
              photo={macbook}
              handler={addToCartHandler}
            />
            <ProductCard
              productId="jfbvad"
              name="Macbook"
              price={80000}
              stock={20}
              photo={macbook}
              handler={addToCartHandler}
            />
          </div>
          <article>
            <button
              disabled={!isPrevPage}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Prev
            </button>
            <span>
              {page} of {4}
            </span>
            <button
              disabled={!isNextPage}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </article>
        </div>
      </main>
    </div>
  );
};

export default Search;
