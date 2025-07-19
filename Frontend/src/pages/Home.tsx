import toast from "react-hot-toast";
import { FaLongArrowAltRight } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import ProductCard from "../components/ProductCard";
import { useLatestProductsQuery } from "../redux/api/productApi";
import { addToCart } from "../redux/reducer/cartReducer";
import { CartItem } from "../types/apiTypes";

const Home = () => {
  const {data, error, isLoading} = useLatestProductsQuery();
  const dispatch = useDispatch();

  if (error) {
    toast.error("Something went wrong while fetching products");
  }

  const addToCartHandler = (cartItem: CartItem) => {
    if(cartItem.stock < 1) {
      toast.error("Product is out of stock");
    } 

    dispatch(addToCart(cartItem));
    toast.success("Item is added");
  };

  return (
    <div className="home container">
      <section className="coverImageHome"></section>

      <section className="latestProductHome">
        <div>
          <h1>Latest Products</h1>
          <Link to={"/search"}>
            More
            <FaLongArrowAltRight />
          </Link>
        </div>
        <main>
          { isLoading && (<Loader />) }
          {data?.data.map((product) => (
            <ProductCard
            key={product._id}
            productId={product._id}
            name={product.title}
            price={product.price}
            stock={product.stock}
            photo={product.productPhoto}
            handler={addToCartHandler}
          />
          ))}
        </main>
      </section>
    </div>
  );
};

export default Home;
