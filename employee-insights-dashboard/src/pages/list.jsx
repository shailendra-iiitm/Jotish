import { useEffect, useState } from "react";
import { fetchEmployees } from "../api/employeeApi";
import VirtualizedTable from "../components/virtualizedTable";
import { useNavigate } from "react-router-dom";
export default function List() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const res = await fetchEmployees();

      const rows = res.TABLE_DATA.data;

      const formatted = rows.map((row, index) => ({
        id: index,
        name: row[0],
        position: row[1],
        city: row[2],
        extension: row[3],
        startDate: row[4],
        salary: row[5],
      }));

      setData(formatted);
    }

    load();
  }, []);

  return (
    <div className="p-6">
      <button
        onClick={() => navigate("/analytics")}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        View Analytics
      </button>

      <h1 className="text-xl font-bold mb-4">Employee List</h1>

      {/* Header */}
      <div className="flex font-semibold border-b pb-2 mb-2">
        <div className="w-[220px]">Name</div>
        <div className="w-[220px]">Position</div>
        <div className="w-[160px]">City</div>
        <div className="w-[140px]">Salary</div>
      </div>

      <VirtualizedTable data={data} />
    </div>
  );
}
