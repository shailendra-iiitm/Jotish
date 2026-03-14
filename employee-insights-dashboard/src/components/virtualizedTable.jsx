import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function VirtualizedTable({ data }) {

  const navigate = useNavigate();

  const containerRef = useRef(null);

  const [scrollTop, setScrollTop] = useState(0);

  const rowHeight = 50;
  const containerHeight = 500;

  const visibleRows = Math.ceil(containerHeight / rowHeight);
  const buffer = 5;

  const totalHeight = data.length * rowHeight;

  const startIndex = Math.max(
    0,
    Math.floor(scrollTop / rowHeight) - buffer
  );

  const endIndex = Math.min(
    data.length,
    startIndex + visibleRows + buffer * 2
  );

  const visibleData = data.slice(startIndex, endIndex);

  const handleScroll = () => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  };

  return (

    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="h-[500px] overflow-y-auto border"
    >

      {/* spacer that creates full scroll height */}
      <div
        style={{
          height: totalHeight,
          position: "relative"
        }}
      >

        {/* visible rows container */}
        <div
          style={{
            position: "absolute",
            top: startIndex * rowHeight,
            left: 0,
            right: 0
          }}
        >

          {visibleData.map((employee) => (

            <div
              key={employee.id}
              onClick={() => navigate(`/details/${employee.id}`)}
              className="flex items-center border-b bg-white hover:bg-gray-50 cursor-pointer"
              style={{ height: rowHeight }}
            >

              <div className="w-[220px] px-2">
                {employee.name}
              </div>

              <div className="w-[220px] px-2">
                {employee.position}
              </div>

              <div className="w-[160px] px-2">
                {employee.city}
              </div>

              <div className="w-[140px] px-2">
                {employee.salary}
              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}
