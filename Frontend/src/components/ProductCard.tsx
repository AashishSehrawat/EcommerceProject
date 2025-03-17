import { FaPlus } from "react-icons/fa";

interface ProductProps {
  productId: string;
  photo: string;
  name: string;
  price: number;
  stock: number;
  handler: () => void;
}

const server = "bdfkljbvdfj";

const ProductCard = ({
  productId,
  photo,
  price,
  name,
  stock,
  handler,
}: ProductProps) => {
  return (
    <div className="productCard">
      <div className="imageProductCard">
        <img src={photo} alt={name} />
      </div>
      <div>
        <h5>{name}</h5>
        <h4>₹{price}</h4>
      </div>

      <div className="addProductCard">
        <button onClick={() => handler()}>
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
