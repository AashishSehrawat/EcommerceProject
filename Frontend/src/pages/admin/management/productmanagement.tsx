import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useDeleteProductMutation, useProductDetailsQuery, useUpdateProductMutation } from "../../../redux/api/productApi";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";


const Productmanagement = () => {
  const params = useParams();
  const {data} = useProductDetailsQuery(params?.id || "");

  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const navigate = useNavigate();

  const [product, setProduct] = useState({
    photo: "",
    name: "", 
    stock: 0,
    price: 0,
    category: ""
  });

  const {price, stock, name, category, photo} = product;

  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category);
  const [photoUpdate, setPhotoUpdate] = useState<string>(photo);
  const [photoFile, setPhotoFile] = useState<File>();

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoUpdate(reader.result);
          setPhotoFile(file);
        }
      };
    }
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", nameUpdate);
      formData.append("category", categoryUpdate);
      formData.append("price", priceUpdate.toString());
      formData.append("stock", stockUpdate.toString());
      if (photoFile) {
        formData.append("productPhoto", photoFile);
      }

      const res = await updateProduct({id: params.id || "", productData: formData}).unwrap();
      if (res?.success) {
        toast.success("Product updated successfully");
        setNameUpdate("");
        setCategoryUpdate("");
        setPriceUpdate(0);
        setStockUpdate(0);
        setPhotoUpdate("");
        setPhotoFile(undefined);
        navigate("/admin/product");
      } else {
        toast.error(res.message || "Failed to update product. Please try again.");
        return;
      }
    } catch (error) {
      toast.error("Failed to update product. Please try again.");
      return;
    }

  };

  const deleteHandler = async () => {
    try {
      const res = await deleteProduct(params.id || "").unwrap();
      if (res?.success) {
        toast.success("Product deleted successfully");
        navigate("/admin/product");
      } else {
        toast.error(res.message || "Failed to delete product. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to delete product. Please try again.");
    }
  };

  useEffect(() => {
    if(data) {
      setProduct({
        photo: data.data.productPhoto,
        name: data.data.title,
        stock: data.data.stock,
        price: data.data.price,
        category: data.data.category
      });
      setNameUpdate(data.data.title);
      setPriceUpdate(data.data.price);
      setStockUpdate(data.data.stock);
      setCategoryUpdate(data.data.category);
      setPhotoUpdate(data.data.productPhoto);
    }
  }, [data])

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <section>
          <strong>ID - {data?.data._id}</strong>
          <img src={photo} alt="Product" />
          <p>{name}</p>
          {stock > 0 ? (
            <span className="green">{stock} Available</span>
          ) : (
            <span className="red"> Not Available</span>
          )}
          <h3>₹{price}</h3>
        </section>
        <article>
          <button className="product-delete-btn" onClick={deleteHandler}>
            <FaTrash />
          </button>
          <form onSubmit={submitHandler}>
            <h2>Manage</h2>
            <div>
              <label>Name</label>
              <input
                type="text"
                placeholder="Name"
                value={nameUpdate}
                onChange={(e) => setNameUpdate(e.target.value)}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                type="number"
                placeholder="Price"
                value={priceUpdate}
                onChange={(e) => setPriceUpdate(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Stock</label>
              <input
                type="number"
                placeholder="Stock"
                value={stockUpdate}
                onChange={(e) => setStockUpdate(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Category</label>
              <input
                type="text"
                placeholder="eg. laptop, camera etc"
                value={categoryUpdate}
                onChange={(e) => setCategoryUpdate(e.target.value)}
              />
            </div>

            <div>
              <label>Photo</label>
              <input type="file" onChange={changeImageHandler} />
            </div>

            {photoUpdate && <img src={photoUpdate} alt="New Image" />}
            <button type="submit">Update</button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default Productmanagement;
