import { Link } from "react-router-dom";
import { FaLongArrowAltRight } from "react-icons/fa";
import ProductCard from "../components/ProductCard";
import { useLatestProductsQuery } from "../redux/api/productApi";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const Home = () => {
  const {data, error, isLoading} = useLatestProductsQuery();

  if (error) {
    toast.error("Something went wrong while fetching products");
  }

  const addToCartHandler = () => {};

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
