import { useState, useRef } from "react";

export default function VirtualizedTable({ data }) {

  const containerRef = useRef(null);

  const [scrollTop, setScrollTop] = useState(0);

  const rowHeight = 50;

  const visibleRows = 10;

  const totalHeight = data.length * rowHeight;

  const startIndex = Math.floor(scrollTop / rowHeight);

  const endIndex = startIndex + visibleRows;

  const visibleData = data.slice(startIndex, endIndex);

  const handleScroll = () => {
    setScrollTop(containerRef.current.scrollTop);
  };

  return (

    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="h-[500px] overflow-y-auto border"
    >

      <div style={{ height: totalHeight }}>

        <div
          style={{
            transform: `translateY(${startIndex * rowHeight}px)`
          }}
        >

          {visibleData.map((employee, index) => (

            <div
              key={index}
              className="flex gap-6 border-b p-3"
              style={{ height: rowHeight }}
            >
              <div>{employee.id}</div>
              <div>{employee.name}</div>
              <div>{employee.city}</div>
              <div>{employee.salary}</div>
            </div>

          ))}

        </div>

      </div>

    </div>

  );

}