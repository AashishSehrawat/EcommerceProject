import { useState, useMemo, useEffect } from "react";
import Select from "react-select";
import countryList from "react-select-country-list";
import { CartReducerInitialState } from "../redux/reducer/cartReducer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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
  const { cartItems } = useSelector((state: { cart: CartReducerInitialState }) => state.cart);
  const navigate = useNavigate();
  
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [pinCode, setPinCode] = useState<string>("");

  const submitHandler = () => {};

  useEffect(() => {
    if(cartItems.length <=0) navigate("/cart");
  }, [cartItems]) 

  

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
          type="text"
          placeholder="Pin Code"
          required
          value={pinCode}
          onChange={(e) => setPinCode(e.target.value)}
        />
        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
};

export default Shipping;
