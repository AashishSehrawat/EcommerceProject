import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItemCard from "../components/CartItem";
import {
  addToCart,
  calulatePrice,
  CartReducerInitialState,
  discountApply,
  removeCartItem,
} from "../redux/reducer/cartReducer";
import { CartItem, DiscountApplyResponse } from "../types/apiTypes";
import axios from "axios";

const Cart = () => {
  const { cartItems, subtotal, tax, total, shippingCharges, discount } =
    useSelector((state: { cart: CartReducerInitialState }) => state.cart);

  const dispatch = useDispatch();

  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  const incrementHandler = (cartItem: CartItem) => {
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
  };

  const decrementHandler = (cartItem: CartItem) => {
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
  };

  const removeHandler = (productId: string) => {
    dispatch(removeCartItem(productId));
  };

  useEffect(() => {
    const controller = new AbortController();

    const timeOutId = setTimeout(() => {
      axios
        .get<DiscountApplyResponse>(
          `http://localhost:3000/api/v1/payment/discount?coupon=${couponCode}`,
          {
            // signal: controller.signal,
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
          },
        )
        .then((res) => {
            dispatch(discountApply(res.data.data!));
            setIsValidCouponCode(true);
            dispatch(calulatePrice());
        })
        .catch((e) => {  
          if(e.name !== "CanceledError"){
            dispatch(discountApply(0));
            setIsValidCouponCode(false);
            dispatch(calulatePrice());
          }
        });
    }, 1000);

    return () => {
      clearTimeout(timeOutId);
      controller.abort();
      setIsValidCouponCode(false);
    };
  }, [couponCode]);

  useEffect(() => {
    dispatch(calulatePrice());
  }, [cartItems]);

  return (
    <div className="cart container">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((item, ind) => (
            <CartItemCard
              incrementHandler={incrementHandler}
              decrementHandler={decrementHandler}
              removeHandler={removeHandler}
              key={ind}
              cartItem={item}
            />
          ))
        ) : (
          <h1>No Items Added</h1>
        )}
      </main>
      <aside>
        <div className="asideContentCart">
          <div className="totalPriceCart">
            <p>Subtotal: ₹{subtotal}</p>
            <p>Shipping Charges: ₹{shippingCharges}</p>
            <p>Tax: ₹{tax}</p>
            <p>
              Discount: <span className="red"> - ₹{discount}</span>
            </p>
            <p>Total: ₹{total}</p>
          </div>
          <div className="couponCart">
            <input
              type="text"
              placeholder="Coupon Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            {couponCode &&
              (isValidCouponCode ? (
                <span className="green">
                  ₹{discount} off using the <code>{couponCode}</code>
                </span>
              ) : (
                <span className="red">
                  Invalid Coupon <VscError />
                </span>
              ))}
            {cartItems.length > 0 && <Link to={"/shipping"}>Checkout</Link>}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Cart;
