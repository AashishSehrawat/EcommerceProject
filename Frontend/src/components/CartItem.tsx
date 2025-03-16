import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";

interface CartItemProps {
  cartItem: any;
}

const CartItem = ({ cartItem }: CartItemProps) => {
  const { productId, photo, name, price, quantity } = cartItem;

  const [quantityItem, setQuantityItem] = useState<number>(quantity);

  const incrementQuantity = () => {
    setQuantityItem((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantityItem((prev) => prev - 1);
  };

  return (
    <div className="cartItem">
      <div className="imageOfCartItem">
        <img src={photo} alt={name} />
      </div>

      <article>
        <Link to={`/product/${productId}`}>{name}</Link>
        <span>₹{price}</span>
      </article>
      <div className="qunatityofCartItem">
        <button onClick={decrementQuantity}>
          {" "}
          <FaMinus />{" "}
        </button>
        {
            quantityItem > 0 &&  <p>{quantityItem}</p>
        }
        <button onClick={incrementQuantity}>
          {" "}
          <FaPlus />{" "}
        </button>
      </div>
      <button>
        <AiFillDelete />
      </button>
    </div>
  );
};

export default CartItem;
