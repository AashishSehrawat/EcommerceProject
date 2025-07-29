import { ReactElement, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useAllUsersQuery, useDeleteUserMutation } from "../../redux/api/authApi";
import toast from "react-hot-toast";
import Toss from "./apps/toss";

interface DataType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "avatar",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

// const img = "https://randomuser.me/api/portraits/women/54.jpg";
// const img2 = "https://randomuser.me/api/portraits/women/50.jpg";

// const arr: Array<DataType> = [
//   {
//     avatar: (
//       <img
//         style={{
//           borderRadius: "50%",
//         }}
//         src={img}
//         alt="Shoes"
//       />
//     ),
//     name: "Emily Palmer",
//     email: "emily.palmer@example.com",
//     gender: "female",
//     role: "user",
//     action: (
//       <button>
//         <FaTrash />
//       </button>
//     ),
//   },

//   {
//     avatar: (
//       <img
//         style={{
//           borderRadius: "50%",
//         }}
//         src={img2}
//         alt="Shoes"
//       />
//     ),
//     name: "May Scoot",
//     email: "aunt.may@example.com",
//     gender: "female",
//     role: "user",
//     action: (
//       <button>
//         <FaTrash />
//       </button>
//     ),
//   },
// ];                              

const Customers = () => {
  const {data, isError, error} = useAllUsersQuery();

  const [rows, setRows] = useState<DataType[]>([]);

  if (isError) {
    console.error("Failed to fetch users:", error);
    toast.error("Failed to fetch users");
  }

  const [deleteUser] = useDeleteUserMutation();

  const deleteHandler = async (userId: string) => {
    const res = await deleteUser(userId);
    if (res.error) {
      toast.error("Failed to delete user");
    }
    toast.success("User deleted successfully");
    // setRows(rows.filter(row => row.email !== res.data?.data.email)); // Update rows after deletion
  }

  useEffect(() => {
    if(data) setRows(data?.data.map(i => ({
      avatar: <img style={{ borderRadius: "50%" }} src={i.photo} alt={i.name} />,
      name: i.name,   
      email: i.email,
      gender: i.gender,
      role: i.role,
      action: (
        <button onClick={() => deleteHandler(i._id)}>
          <FaTrash />
        </button>
      ),
    })));
  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Customers",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{Table}</main>
    </div>
  );
};

export default Customers;
