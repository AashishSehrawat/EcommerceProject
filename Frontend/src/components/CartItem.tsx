import { FaPlus, FaMinus } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { CartItem as CartItemType } from "../types/apiTypes";

interface CartItemProps {
  cartItem: CartItemType;
  incrementHandler: (cartItem: CartItemType) => void  
  decrementHandler: (cartItem: CartItemType) => void  
  removeHandler: (id: string) => void  
}

const CartItem = ({ cartItem, incrementHandler, decrementHandler, removeHandler }: CartItemProps) => {
  const { productId, photo, name, price, quantity } = cartItem; 

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
        <button onClick={() => decrementHandler(cartItem)} disabled={quantity <= 1}>
          {" "}
          <FaMinus />{" "}
        </button>
        {
            quantity >= 1 && <p>{quantity}</p>
        }
        <button onClick={() => incrementHandler(cartItem)} disabled={quantity > cartItem.stock}>
          {" "}
          <FaPlus />{" "}
        </button>
      </div>

      <button onClick={() => removeHandler(cartItem.productId)}>
        <AiFillDelete />
      </button>
    </div> 
  );
};

export default CartItem;
