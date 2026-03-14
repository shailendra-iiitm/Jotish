import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Details() {

  const { id } = useParams();
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [photo, setPhoto] = useState(null);

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

  const capturePhoto = () => {

    const video = videoRef.current;
    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    const image = canvas.toDataURL("image/png");

    setPhoto(image);

  };

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

      {!photo && (
        <>
          <video
            ref={videoRef}
            autoPlay
            className="w-[400px] border"
          />

          <button
            onClick={capturePhoto}
            className="mt-4 px-4 py-2 bg-blue-500 text-white"
          >
            Capture Photo
          </button>
        </>
      )}

      {photo && (
        <img
          src={photo}
          alt="Captured"
          className="w-[400px] border"
        />
      )}

      {/* hidden canvas used for capture */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

    </div>

  );

}
