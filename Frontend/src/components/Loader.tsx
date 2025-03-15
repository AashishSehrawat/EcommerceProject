import loader from "../assets/loader.gif";

const Loader = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
      }}
    >
      <img src={loader} />
    </div>
  );
};

export default Loader;
