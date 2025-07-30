import AdminSidebar from "../../../components/admin/AdminSidebar";
import { DoughnutChart, PieChart } from "../../../components/admin/Charts";
import data from "../../../assets/data.json";
import { usePieQuery } from "../../../redux/api/dashboardApi";
import toast from "react-hot-toast";
import Loader from "../../../components/admin/Loader";

const PieCharts = () => {
  const {isLoading, data, isError, error} = usePieQuery();
  if (isError) {
    console.log("Error fetching pie chart data:", error);
    toast.error("Failed to load pie chart data");
  }

  if (isLoading) {
    return <div><Loader/></div>;
  }

  const stats = data?.data!;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>Pie & Doughnut Charts</h1>
        <section>
          <div>
            <PieChart
              labels={["Processing", "Shipped", "Delivered"]}
              data={[stats.orderFullfillment.processing, stats.orderFullfillment.shipped, stats.orderFullfillment.delivered]}
              backgroundColor={[
                `hsl(110,80%, 80%)`,
                `hsl(110,80%, 50%)`,
                `hsl(110,40%, 50%)`,
              ]}
              offset={[0, 0, 50]}
            />
          </div>
          <h2>Order Fulfillment Ratio</h2>
        </section>

        <section>
          <div>
            <DoughnutChart
              labels={stats.categoryNameAndCount.map((i: Record<string, number>) => Object.keys(i)[0])}
              data={stats.categoryNameAndCount.map((i: Record<string, number>) => Object.values(i)[0])}
              backgroundColor={stats.categoryNameAndCount.map(
                (i: Record<string, number>) => {
                  const value = Object.values(i)[0];
                  return `hsl(${value * 4}, ${value}%, 50%)`
                }
              )}
              legends={false}
              offset={[0, 0, 0, 80]}
            />
          </div>
          <h2>Product Categories Ratio</h2>
        </section>

        <section>
          <div>
            <DoughnutChart
              labels={["In Stock", "Out Of Stock"]}
              data={[stats.stockAvaliability.inStock, stats.stockAvaliability.outOfStock]}
              backgroundColor={["hsl(269,80%,40%)", "rgb(53, 162, 255)"]}
              legends={false}
              offset={[0, 80]}
              cutout={"70%"}
            />
          </div>
          <h2> Stock Availability</h2>
        </section>

        <section>
          <div>
            <DoughnutChart
              labels={[
                "Marketing Cost",
                "Discount",
                "Burnt",
                "Production Cost",
                "Net Margin",
              ]}
              data={[stats.revenueDistribution.marketingCost, stats.revenueDistribution.discount, stats.revenueDistribution.burnt, stats.revenueDistribution.productCost, stats.revenueDistribution.netMargin]}
              backgroundColor={[
                "hsl(110,80%,40%)",
                "hsl(19,80%,40%)",
                "hsl(69,80%,40%)",
                "hsl(300,80%,40%)",
                "rgb(53, 162, 255)",
              ]}
              legends={false}
              offset={[20, 30, 20, 30, 80]}
            />
          </div>
          <h2>Revenue Distribution</h2>
        </section>

        <section>
          <div>
            <PieChart
              labels={[
                "Teenager(Below 20)",
                "Adult (20-40)",
                "Older (above 40)",
              ]}
              data={[stats.userAgeGroup.teen, stats.userAgeGroup.adult, stats.userAgeGroup.old]}
              backgroundColor={[
                `hsl(10, ${80}%, 80%)`,
                `hsl(10, ${80}%, 50%)`,
                `hsl(10, ${40}%, 50%)`,
              ]}
              offset={[0, 0, 50]}
            />
          </div>
          <h2>Users Age Group</h2>
        </section>

        <section>
          <div>
            <DoughnutChart
              labels={["Admin", "Customers"]}
              data={[stats.adminUserCount.admin, stats.adminUserCount.user]}
              backgroundColor={[`hsl(335, 100%, 38%)`, "hsl(44, 98%, 50%)"]}
              offset={[0, 50]}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default PieCharts;
