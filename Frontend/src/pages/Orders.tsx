import { ReactElement, useEffect, useState } from "react";
import TableHOC from "../components/admin/TableHOC";
import { Column } from "react-table";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMyOrdersQuery } from "../redux/api/orderApi";
import toast from "react-hot-toast";

interface DataType {
  _id: string;
  amount: number;
  quantity: number;
  discount: number;
  status: ReactElement;
  action: ReactElement;
}

const column: Column<DataType>[] = [
  {
    Header: "ID",
    accessor: "_id",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Discount",
    accessor: "discount",
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

const Orders = () => {
  const { user } = useSelector((state: any) => state.auth)

  const {data, isError} = useMyOrdersQuery(user._id);
  if(isError) {
    toast.error("Failed to fetch the orders");
  }


  const [rows, setRows] = useState<DataType[]>([]);

  useEffect(() => {
    if(data) setRows(data.data.map(i => ({
      _id: i._id,
      amount: i.total,
      quantity: i.orderItems.length,
      discount: i.discount,
      status: <span className={
        i.status == "Processing" ? "red" : i.status == "Shipped" ? "green" : "purple"
      }>{i.status}</span>,
      action: <Link to={`/orders/${i._id}`}>View</Link>, 
    })))
  }, [data])

  const Table = TableHOC<DataType>(
    column,
    rows,
    "dashboard-product-box",
    "Orders",
    rows.length > 6
  )();

  return (
    <div className="orders container">
      <h1>My orders</h1>
      <div>{Table}</div>
    </div>
  );
};

export default Orders;
