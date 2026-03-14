import { useParams, useNavigate } from "react-router-dom";

export default function Details() {

  const { id } = useParams();
  const navigate = useNavigate();

  return (

    <div className="p-6">

      <button
        onClick={() => navigate("/list")}
        className="mb-4 text-blue-500"
      >
        ← Back
      </button>

      <h1 className="text-xl font-bold mb-4">
        Employee Verification
      </h1>

      <p className="mb-6">
        Employee ID: {id}
      </p>

      {/* camera will go here */}

      <div className="border p-4">

        <p className="text-gray-500">
          Camera preview will appear here
        </p>

      </div>

    </div>

  );

}
