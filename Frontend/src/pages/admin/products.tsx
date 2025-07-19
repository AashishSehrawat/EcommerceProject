import { ReactElement, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useAllAdminProductsQuery } from "../../redux/api/productApi";
import toast from "react-hot-toast";
import { CustomError } from "../../types/apiTypes";

interface DataType {
  photo: ReactElement;
  name: string;
  price: number;
  stock: number;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Photo",
    accessor: "photo",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
    Header: "Stock",
    accessor: "stock",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];


const Products = () => {
  const { data, isLoading, isError, error } = useAllAdminProductsQuery();

  const [rows, setRows] = useState<DataType[]>([]);

  if(isError) toast.error((error as CustomError).message);

  useEffect(() => {
  if(data) setRows(data?.data.map(i => ({
    photo: <img src={i.productPhoto}/>,
    name: i.title,
    price: i.price,
    stock: i.stock,
    action: <Link key={i._id} to={`/admin/product/${i._id}`}>Manage</Link>
  })))
  }, [data])



  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Products",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{Table}</main>
      <Link to="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Products;
