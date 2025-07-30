import ProductCard from "../components/ProductCard";
import { useState } from "react";
import {
  useCategoriesQuery,
  useSearchProductsQuery,
} from "../redux/api/productApi";
import toast from "react-hot-toast";
import { CartItem, CustomError } from "../types/apiTypes";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const {
    data: categoriesResponse,
    isError: isCategoriesError,
    error: categoriesError,
  } = useCategoriesQuery();

  if (isCategoriesError) {
    toast.error(
      (categoriesError as CustomError).message || "Failed to fetch categories"
    );
  }

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const {
    data: searchData,
    isError: isSearchError,
    error: searchError,
  } = useSearchProductsQuery({
    price: maxPrice,
    search,
    sort,
    category,
    page,
  });

  if(isSearchError) {
    toast.error(
      (searchError as CustomError).message || "Failed to fetch products"
    );
  }

  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  console.log("user", user);

  const dispatch = useDispatch();
  const addToCartHandler = (cartItem: CartItem) => {
    if(!user) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    if(cartItem.stock < 1) {
      toast.error("Product is out of stock");
    } 

    dispatch(addToCart(cartItem));
    toast.success("Item is added");
  };

  const isNextPage = page < (searchData?.data.totalPages || 1);
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
                {categoriesResponse?.data.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
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
            {searchData?.success ? (
              searchData?.data.products.map((product) => (
                <ProductCard
                  productId={product._id}
                  key={product._id}
                  name={product.title}
                  price={product.price}
                  stock={product.stock}
                  photo={product.productPhoto}
                  handler={addToCartHandler}
                />
              ))
            ) : (
              <>
                <h2>No Product Found</h2>
              </>
            )}
          </div>
          {searchData?.data.totalPages! > 1 && (
            <article>
              <button
                disabled={!isPrevPage}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Prev
              </button>
              <span>
                {page} of {searchData?.data.totalPages || 1}
              </span>
              <button
                disabled={!isNextPage}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </button>
            </article>
          )}
        </div>
      </main>
    </div>
  );
};

export default Search;
