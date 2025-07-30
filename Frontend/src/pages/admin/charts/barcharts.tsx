import toast from "react-hot-toast";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { BarChart } from "../../../components/admin/Charts";
import Loader from "../../../components/admin/Loader";
import { useBarQuery } from "../../../redux/api/dashboardApi";
import { getLastMonths } from "../../../utils/features";


const {last6Months, last12Months} = getLastMonths();
console.log(last12Months);

const Barcharts = () => {
  const {isLoading, data, isError, error} = useBarQuery();
  if (isLoading) return <div><Loader/></div>;
  if(isError){
    console.log("Error fetching bar chart data:", error);
    toast.error("Failed to fetch bar chart data");
  }

  const stats = data?.data!;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>Bar Charts</h1>
        <section>
          <BarChart
            data_2={stats.user}
            data_1={stats.product}
            title_1="Products"
            title_2="Users"
            labels={last6Months}
            bgColor_1={`hsl(260, 50%, 30%)`}
            bgColor_2={`hsl(360, 90%, 90%)`}
          />
          <h2>Top Products & Top Customers</h2>
        </section>

        <section>
          <BarChart
            horizontal={true}
            data_1={stats.order}
            data_2={[]}
            title_1="Orders"
            title_2=""
            bgColor_1={`hsl(180, 40%, 50%)`}
            bgColor_2=""
            labels={last12Months}
          />
          <h2>Orders throughout the year</h2>
        </section>
      </main>
    </div>
  );
};

export default Barcharts;
