import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LogoutButton from "../components/logoutButton";

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const signatureCanvasRef = useRef(null);
  const drawingRef = useRef(false);
  const [hasSignature, setHasSignature] = useState(false);

  const [photo, setPhoto] = useState(null);
  const [finalImage, setFinalImage] = useState(null);
  const [photoSize, setPhotoSize] = useState({ width: 0, height: 0 });

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
    setPhotoSize({ width: video.videoWidth, height: video.videoHeight });
  };

  const getPoint = (canvas, e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const { x, y } = getPoint(canvas, e);

    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(x, y);

    if (canvas.setPointerCapture) {
      canvas.setPointerCapture(e.pointerId);
    }

    drawingRef.current = true;
  };

  const draw = (e) => {
    if (!drawingRef.current) return;

    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const { x, y } = getPoint(canvas, e);

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = (e) => {
    const canvas = signatureCanvasRef.current;

    if (canvas && canvas.releasePointerCapture && canvas.hasPointerCapture(e.pointerId)) {
      canvas.releasePointerCapture(e.pointerId);
    }

    drawingRef.current = false;
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
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
      ctx.drawImage(signatureCanvas, 0, 0);
      const merged = mergedCanvas.toDataURL("image/png");
      setFinalImage(merged);
    };
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-[700px]">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/list")}
            className="text-blue-500"
          >
            ← Back
          </button>

          <LogoutButton />
        </div>

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
                <div className="relative w-[500px] rounded border overflow-hidden">
                  <img
                    src={photo}
                    className="w-full block"
                  />

                  <canvas
                    ref={signatureCanvasRef}
                    width={photoSize.width}
                    height={photoSize.height}
                    className="absolute inset-0 w-full h-full cursor-crosshair"
                    style={{ touchAction: "none" }}
                    onPointerDown={startDrawing}
                    onPointerMove={draw}
                    onPointerUp={stopDrawing}
                    onPointerCancel={stopDrawing}
                    onPointerLeave={stopDrawing}
                  />
                </div>
              )}
            </div>

            {photo && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={clearSignature}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
                >
                  Clear Signature
                </button>
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
