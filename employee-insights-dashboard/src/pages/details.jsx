import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Details() {

  const { id } = useParams();
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const signatureCanvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);


  const [photo, setPhoto] = useState(null);
  const [finalImage, setFinalImage] = useState(null);


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

    const startDrawing = (e) => {
    const canvas = signatureCanvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setDrawing(true);
    };

    const draw = (e) => {
    if (!drawing) return;
    const canvas = signatureCanvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
    };

    const stopDrawing = () => {
    setDrawing(false);
    };

    const mergeImages = () => {
    const signatureCanvas = signatureCanvasRef.current;
    const mergedCanvas = document.createElement("canvas");
    const ctx = mergedCanvas.getContext("2d");
    const image = new Image();
    image.src = photo;
    image.onload = () => {
        mergedCanvas.width = image.width;
        mergedCanvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        ctx.drawImage(
        signatureCanvas,
        0,
        image.height - 200
        );
        const merged = mergedCanvas.toDataURL("image/png");
        setFinalImage(merged);
    };
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
            <div className="mt-4">

                <img
                src={photo}
                alt="Captured"
                className="w-[400px] border"
                />

                <p className="mt-4 font-semibold">
                Sign Below
                </p>

                <canvas
                ref={signatureCanvasRef}
                width={400}
                height={200}
                className="border mt-2"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                />

            </div>
            )}

            <button onClick={mergeImages}
                className="mt-4 px-4 py-2 bg-green-500 text-white"
            >
            Generate Audit Image  </button>

            {finalImage && (
            <div className="mt-6">
                <h2 className="font-bold mb-2">
                Final Audit Image
                </h2>
                <img
                src={finalImage}
                alt="Audit"
                className="w-[400px] border"
                />
            </div>
            )}

      {/* hidden canvas used for capture */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

    </div>

  );

}
