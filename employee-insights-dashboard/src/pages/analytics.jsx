import { useEffect, useState } from "react";
import { fetchEmployees } from "../api/employeeApi";
import SalaryChart from "../components/SalaryChart";

export default function Analytics() {
  const [data, setData] = useState([]);

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
      <h1 className="text-2xl font-bold mb-6">Salary Distribution by City</h1>

      <SalaryChart data={data} />
    </div>
  );
}
