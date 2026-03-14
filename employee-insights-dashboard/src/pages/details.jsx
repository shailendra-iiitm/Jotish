import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Details() {

  const { id } = useParams();
  const navigate = useNavigate();

  const videoRef = useRef(null);

  useEffect(() => {

    async function startCamera() {

      try {

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

      } catch (err) {

        console.error("Camera error:", err);

      }

    }

    startCamera();

  }, []);

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

      <video
        ref={videoRef}
        autoPlay
        className="w-[400px] border"
      />

    </div>

  );

}
