import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEmployees } from "../api/employeeApi";
import SalaryChart from "../components/salaryChart";
import CityMap from "../components/cityMap";
import LogoutButton from "../components/logoutButton";

export default function Analytics() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const res = await fetchEmployees();

      const rows = res.TABLE_DATA.data;

      const formatted = rows.map((row, index) => ({
        id: index,
        name: row[0],
        city: row[2],
        salary: row[5],
      }));

      setData(formatted);
    }

    load();
  }, []);

  return (
    <div className="p-8">
      <div className="mb-6 flex gap-3">
        <button
          onClick={() => navigate("/list")}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Back to List
        </button>

        <LogoutButton />
      </div>

      <h1 className="text-2xl font-bold mb-6">Salary Distribution by City</h1>
      <SalaryChart data={data} />
      <h2 className="text-xl font-bold mt-10 mb-4">City Locations</h2>
      <CityMap data={data} />
    </div>
  );
}
