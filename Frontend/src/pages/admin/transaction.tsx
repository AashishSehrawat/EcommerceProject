import { ReactElement, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import Loader from "../../components/Loader";
import { useAllOrdersQuery } from "../../redux/api/orderApi";

interface DataType {
  user: string;
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
  action: ReactElement; 
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "user",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Transaction = () => {
  const {isLoading, data, isError, error} = useAllOrdersQuery();

  const [rows, setRows] = useState<DataType[]>([]);

  useEffect(() => {
    if(data) setRows(data?.data.map(i => ({
      user: i.user?.name || "Unknown User",
      amount: i.total,
      discount: i.discount,
      quantity: i.orderItems.length,
      status: <span className={
        i.status == "Processing" ? "red" : i.status == "Shipped" ? "green" : "purple"
      }>{i.status}</span>,
      action: <Link to={`/admin/transaction/${i._id}`}>Manage</Link>,
    })))
  }, [data])

  const TableComponent = useMemo(() => {
    return TableHOC<DataType>(
      columns,
      rows,
      "dashboard-product-box",
      "Transactions",
      rows.length > 6
    );
  }, [rows]);

  if(isLoading) {
    return (
      <div className="loading">
        <Loader/>
      </div>
    );
  }

  if(isError){
    console.log("Error fetching orders:", error);
    toast.error("Failed to fetch orders");
  } 

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{<TableComponent/>}</main>
    </div>
  );
};

export default Transaction;
