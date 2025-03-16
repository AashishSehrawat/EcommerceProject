const Shipping = () => {

  const submitHandler = () => {};
  
  return (
    <div className="shipping container">
      <h1>Shipping Address</h1>
      <form onSubmit={submitHandler}>
        <input type="text" placeholder="Address" />
        <input type="text" placeholder="City" />
        <input type="text" placeholder="State" />
        <input type="text" placeholder="Choose Country" />
        <input type="number" placeholder="Pin Code" />
        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
};

export default Shipping;
