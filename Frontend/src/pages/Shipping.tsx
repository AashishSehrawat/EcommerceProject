import { useState, useMemo, useEffect, FormEvent } from "react";
import Select from "react-select";
import countryList from "react-select-country-list";
import { CartReducerInitialState, saveShippingInfo } from "../redux/reducer/cartReducer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { PaymentApiResponse } from "../types/apiTypes";

const API_URL = import.meta.env.VITE_API_URL;

interface CountryOption {
  value: string;
  label: string;
}

const CountrySelect = ({
  selectedCountry,
  setSelectedCountry,
}: {
  selectedCountry: string;
  setSelectedCountry: (value: string) => void;
}) => {
  const options: CountryOption[] = useMemo(() => {
    return countryList()
      .getData()
      .map((country) => ({
        value: country.value,
        label: country.label,
      }));
  }, []);

  return (
    <Select
      className="countrySelectShipping"
      options={options}
      value={options.find((option) => option.value === selectedCountry)}
      onChange={(selectedOption) =>
        setSelectedCountry(selectedOption?.value || "")
      }
      placeholder="Select Country..."
    />
  );
};

const Shipping = () => {
  const { cartItems, total } = useSelector(
    (state: { cart: CartReducerInitialState }) => state.cart
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [pincode, setPincode] = useState<number>();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!address || !city || !state || !country || !pincode) {
      return toast.error("All shipping fields are required");
    }

    dispatch(saveShippingInfo({
      address,
      city,
      state,
      country,
      pincode: Number(pincode),
    }));

    try {
      console.log("hii")
      const res = await axios.post<PaymentApiResponse>(
        `${API_URL}/api/v1/payment/create`,
        {
          amount: total,  
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("res", res);

      if(res) {
        navigate("/pay", {
          state: res.data?.data
        })
      }
    } catch (error) {
      console.log("Error in Shipping submit controller", error);
      return toast.error("Something went wrong")
    }
  };

  useEffect(() => {
    if (cartItems.length <= 0) navigate("/cart");
  }, [cartItems]);

  return (
    <div className="shipping container">
      <h1>Shipping Address</h1>
      <form onSubmit={submitHandler}>
        <input
          type="text"
          placeholder="Address"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="City"
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          type="text"
          placeholder="State"
          required
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
        <CountrySelect
          selectedCountry={country}
          setSelectedCountry={setCountry}
        />
        <input
          type="number"
          placeholder="Pin Code"
          required
          value={pincode}
          onChange={(e) => setPincode(Number(e.target.value))}
        />
        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
};

export default Shipping;
