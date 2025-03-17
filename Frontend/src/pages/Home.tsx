import { Link } from "react-router-dom";
import { FaLongArrowAltRight } from "react-icons/fa";
import ProductCard from "../components/ProductCard";
import macbook from '../assets/Products/macbook.jpg'

const Home = () => {
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
                   <ProductCard
            productId="jfbvad"
            name="Macbook"
            price={80000}
            stock={20}
            photo={macbook}
            handler={addToCartHandler}
          />
        </main>
      </section>
    </div>
  );
};

export default Home;
