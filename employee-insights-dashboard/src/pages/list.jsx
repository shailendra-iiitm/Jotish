import { useEffect, useState } from "react";
import { fetchEmployees } from "../api/employeeApi";

export default function List() {

  const [data, setData] = useState([]);

  useEffect(() => {

    async function loadData(){
      const res = await fetchEmployees();
      setData(res.data || []);
    }

    loadData();

  }, []);

  return (
    <div className="p-6">

      <h1 className="text-xl font-bold mb-4">
        Employee List
      </h1>

      <div className="border">

        {data.map((employee, index) => (
          <div
            key={index}
            className="flex gap-6 border-b p-3"
          >
            <div>{employee.id}</div>
            <div>{employee.name}</div>
            <div>{employee.city}</div>
            <div>{employee.salary}</div>
          </div>
        ))}

      </div>

    </div>
  );
}