import toast from "react-hot-toast";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { LineChart } from "../../../components/admin/Charts";
import Loader from "../../../components/admin/Loader";
import { useLineQuery } from "../../../redux/api/dashboardApi";
import { getLastMonths } from "../../../utils/features";


const { last12Months } = getLastMonths();

const Linecharts = () => {
  const {data, isLoading, isError, error} = useLineQuery();
  if (isLoading) {
    return <div><Loader/></div>;
  }
  if (isError) {
    console.log("Error fetching line chart data:", error);
    toast.error("Failed to fetch line chart data. Please try again later.");
  }

  const stats = data?.data!;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>Line Charts</h1>
        <section>
          <LineChart
            data={stats.users}
            label="Users"
            borderColor="rgb(53, 162, 255)"
            labels={last12Months}
            backgroundColor="rgba(53, 162, 255, 0.5)"
          />
          <h2>Active Users</h2>
        </section>

        <section>
          <LineChart
            data={stats.orders}
            backgroundColor={"hsla(269,80%,40%,0.4)"}
            borderColor={"hsl(269,80%,40%)"}
            labels={last12Months}
            label="Products"
          />
          <h2>Total Products (SKU)</h2>
        </section>

        <section>
          <LineChart
            data={stats.revenue}
            backgroundColor={"hsla(129,80%,40%,0.4)"}
            borderColor={"hsl(129,80%,40%)"}
            label="Revenue"
            labels={last12Months}
          />
          <h2>Total Revenue </h2>
        </section>

        <section>
          <LineChart
            data={stats.discount}
            backgroundColor={"hsla(29,80%,40%,0.4)"}
            borderColor={"hsl(29,80%,40%)"}
            label="Discount"
            labels={last12Months}
          />
          <h2>Discount Allotted </h2>
        </section>
      </main>
    </div>
  );
};

export default Linecharts;
