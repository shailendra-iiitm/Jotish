import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const signatureCanvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const [photo, setPhoto] = useState(null);
  const [finalImage, setFinalImage] = useState(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    }

    startCamera();

    // Intentional Bug:
    // Camera stream is not cleaned up on component unmount.
    // This can cause a memory leak if the user navigates away
    // while the stream is active.

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
    setHasSignature(true);
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
      ctx.drawImage(signatureCanvas, 0, image.height - 200);
      const merged = mergedCanvas.toDataURL("image/png");
      setFinalImage(merged);
    };
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-[700px]">
        <button
          onClick={() => navigate("/list")}
          className="text-blue-500 mb-4"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold mb-2">Employee Verification</h1>

        <p className="text-gray-500 mb-6">Employee ID: {id}</p>

        {/* SHOW CAMERA + SIGNATURE ONLY BEFORE MERGE */}

        {!finalImage && (
          <>
            <div className="flex flex-col items-center">
              {!photo && (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    className="w-[500px] rounded border"
                  />

                  <button
                    onClick={capturePhoto}
                    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded"
                  >
                    Capture Photo
                  </button>
                </>
              )}

              {photo && (
                <img src={photo} className="w-[500px] rounded border" />
              )}
            </div>

            {photo && (
              <div className="mt-6">
                <p className="font-semibold mb-2">Sign Below</p>

                <canvas
                  ref={signatureCanvasRef}
                  width={400}
                  height={150}
                  className="border rounded w-full"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
              </div>
            )}

            {hasSignature && (
              <button
                onClick={mergeImages}
                className="mt-4 px-6 py-2 bg-green-500 text-white rounded"
              >
                Generate Audit Image
              </button>
            )}
          </>
        )}

        {/* SHOW ONLY FINAL IMAGE */}

        {finalImage && (
          <div className="flex flex-col items-center">
            <h2 className="font-bold mb-4 text-lg">Final Audit Image</h2>

            <img src={finalImage} className="w-[500px] border rounded" />

            <a
              href={finalImage}
              download="audit-image.png"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Download Image
            </a>
          </div>
        )}

        {/* hidden capture canvas */}

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </div>
  );
}
