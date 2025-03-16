import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import macbook from "../assets/Products/macbook.jpg";
import CartItem from "../components/CartItem";
import { Link } from "react-router-dom";


const subTotal = 4000;
const tax = Math.round(subTotal * 0.18);
const shippingCharge = 200;
const discount = 40;
const totalCharge = subTotal + tax + shippingCharge - discount;

const Cart = () => {
  const cartItems = [
    {
      productId: "aflasjkdnf",
      photo: macbook,
      name: "Macbook",
      price: 80000,
      quantity: 4,
      stock: 10,
    },
    {
      productId: "aflasjkdnf",
      photo: macbook,
      name: "Macbook M4",
      price: 160000,
      quantity: 4,
      stock: 10,
    },
    {
      productId: "aflasjkdnf",
      photo: macbook,
      name: "Macbook M4",
      price: 160000,
      quantity: 4,
      stock: 10,
    },

    {
      productId: "aflasjkdnf",
      photo: macbook,
      name: "Macbook M4",
      price: 160000,
      quantity: 4,
      stock: 10,
    },
    {
      productId: "aflasjkdnf",
      photo: macbook,
      name: "Macbook M4",
      price: 160000,
      quantity: 4,
      stock: 10,
    },
  ];

  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (Math.random() > 0.5) setIsValidCouponCode(true);
      else setIsValidCouponCode(false);
    }, 1000);

    return () => {
      clearTimeout(timeOutId);
      setIsValidCouponCode(false);
    };
  }, [couponCode]);

  return (
    <div className="cart container">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((item, ind) => <CartItem key={ind} cartItem={item} />)
        ) : (
          <h1>No Items Added</h1>
        )}
      </main>
      <aside>
        <div className="asideContentCart">
          <div className="totalPriceCart">
            <p>Subtotal: ₹{subTotal}</p>
            <p>Shipping Charges: ₹{shippingCharge}</p>
            <p>Tax: ₹{tax}</p>
            <p>
              Discount: <span className="red"> - ₹{discount}</span>
            </p>
            <p>Total: ₹{totalCharge}</p>
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
