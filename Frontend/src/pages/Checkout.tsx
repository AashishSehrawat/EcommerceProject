import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { CartReducerInitialState, resetCart } from "../redux/reducer/cartReducer";
import { CreateOrderRequest } from "../types/apiTypes";
import { useNewOrderMutation } from "../redux/api/orderApi";

const stripePromise = loadStripe(
  "pk_test_51RJuL0FmPTEhIEzWID5gvh3JzkhNYG6u0dUTJLKhRuH6bwbXNEnMVnAdVf61nzeP45qEHOnnAN5ZuuP9tH53ycgC00hlHGG4Du"
);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state: { auth: { user: any } }) => state.auth);

  const {
    shippingInfo,
    cartItems,  
    total,
    subtotal,
    tax,
    discount,
    shippingCharges,
  } = useSelector((state: { cart: CartReducerInitialState }) => state.cart);
 
  const [isProcessing, setIsProcesssing] = useState<boolean>(false);

  const [newOrder] = useNewOrderMutation();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Verify shipping info exists
    if (!shippingInfo || 
        !shippingInfo.address ||
        !shippingInfo.city ||
        !shippingInfo.state ||
        !shippingInfo.country ||
        !shippingInfo.pincode) {
      toast.error("Complete shipping information first");
      return navigate("/shipping");
    }

    if (!stripe || !elements) return;
    setIsProcesssing(true);

    const order: CreateOrderRequest = {
      shippingOrderInfo: {
        address: String(shippingInfo.address),
        city: String(shippingInfo.city),
        state: String(shippingInfo.state),
        country: String(shippingInfo.country),
        pincode: Number(shippingInfo.pincode) 
      },
      subTotal: subtotal,
      tax: tax,
      shippingCharges: shippingCharges,
      discount: discount,
      total: total,
      status: "Processing",
      orderItems: cartItems.map(item => ({
        title: item.name,
        photo: item.photo,
        price: item.price,
        quantity: item.quantity,
        productID: item.productId,
      })),
      user: user?._id,
    };

    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
      redirect: "if_required",
    });

    if (error) {
      setIsProcesssing(false);
      return toast.error(error.message || "Payment Failed");
    }

    if (paymentIntent.status === "succeeded") {
      const res = await newOrder(order);
      if (res.error) {
        setIsProcesssing(false);
        return toast.error("Order creation failed");
      }
      dispatch(resetCart());
      console.log("placing order");
      toast.success("Order Placed Successfully");
      console.log("Order Response:", res);
      navigate("/myOrders");
    }

    setIsProcesssing(false);
  };

  return (
    <div className="checkout-container">
      <form onSubmit={submitHandler}>
        <PaymentElement />
        <button type="submit" disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Pay"}
        </button>
      </form>
    </div>
  );
};
const Checkout = () => {
  const location = useLocation();
  const clientSecret: string|undefined = location.state;

  if(!clientSecret) return <Navigate to={"/shipping"} />

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret
      }}
    >
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;
