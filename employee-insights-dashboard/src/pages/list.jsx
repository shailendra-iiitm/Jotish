import { useEffect, useState } from "react";
import { fetchEmployees } from "../api/employeeApi";
import VirtualizedTable from "../components/virtualizedTable";

export default function List(){

  const [data,setData] = useState([]);

  useEffect(()=>{

    async function load(){
      const res = await fetchEmployees();
      setData(res.data || []);
    }

    load();

  },[]);

  return (

    <div className="p-6">

      <h1 className="text-xl font-bold mb-4">
        Employee List
      </h1>

      <VirtualizedTable data={data} />

    </div>

  );

}