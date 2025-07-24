import { FaTrash } from "react-icons/fa";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import {
  useDeleteOrderMutation,
  useSingleOrderDetailsQuery,
  useUpdateOrderMutation,
} from "../../../redux/api/orderApi";
import { OrderItem } from "../../../types/apiTypes";
import toast from "react-hot-toast";

interface ShippingInfo {
  address: string;
  city: string;
  state: string;
  country: string;
  pincode?: number;
}

interface OrderData {
  shippingOrderInfo: ShippingInfo;
  status: string;
  subTotal: number;
  discount: number;
  shippingCharges: number;
  tax: number;
  total: number;
  orderItems: OrderItem[];
  user: string;
  _id: string;
}

const defaultData: OrderData = {
  shippingOrderInfo: {
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: 0,
  },
  status: "",
  subTotal: 0,
  discount: 0,
  shippingCharges: 0,
  tax: 0,
  total: 0,
  orderItems: [],
  user: "",
  _id: "",
};

const TransactionManagement = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { data, isError } = useSingleOrderDetailsQuery(params.id!);

  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  const {
    shippingOrderInfo: { address, city, state, country, pincode },
    orderItems,
    user,
    subTotal,
    tax,
    status,
    shippingCharges,
    discount,
    total,
  } = data?.data || defaultData;

  const updateHandler = async () => {
    await updateOrder(params.id!);
    toast.success("Updated successfully");
    navigate("/admin/transaction");
  };

  const deleteHandler = async () => {
    await deleteOrder(params.id!);
    toast.success("Deleted successfully");
    navigate("/admin/transaction");
  };

  if (isError) return <Navigate to={"/404"} />;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <section
          style={{
            padding: "2rem",
          }}
        >
          <h2>Order Items</h2>

          {orderItems.map((i) => (
            <ProductCard
              key={i._id}
              title={i.title}
              photo={`${i.photo}`}
              productID={i.productID}
              _id={i._id}
              quantity={i.quantity}
              price={i.price}
            />
          ))}
        </section>

        <article className="shipping-info-card">
          <button className="product-delete-btn" onClick={deleteHandler}>
            <FaTrash />
          </button>
          <h1>Order Info</h1>
          <h5>User Info</h5>
          <p>Name: {user}</p>
          <p>
            Address: {`${address}, ${city}, ${state}, ${country}, ${pincode}`}
          </p>
          <h5>Amount Info</h5>
          <p>Subtotal: {subTotal}</p>
          <p>Shipping Charges: {shippingCharges}</p>
          <p>Tax: {tax}</p>
          <p>Discount: {discount}</p>
          <p>Total: {total}</p>

          <h5>Status Info</h5>
          <p>
            Status:{" "}
            <span
              className={
                status === "Delivered"
                  ? "purple"
                  : status === "Shipped"
                  ? "green"
                  : "red"
              }
            >
              {status}
            </span>
          </p>
          <button className="shipping-btn" onClick={updateHandler}>
            Process Status
          </button>
        </article>
      </main>
    </div>
  );
};

const ProductCard = ({
  title,
  photo,
  price,
  quantity,
  productID,
}: OrderItem) => (
  <div className="transaction-product-card">
    <img src={photo} alt={title} />
    <Link to={`/product/${productID}`}>{title}</Link>
    <span>
      ₹{price} X {quantity} = ₹{price * quantity}
    </span>
  </div>
);

export default TransactionManagement;
