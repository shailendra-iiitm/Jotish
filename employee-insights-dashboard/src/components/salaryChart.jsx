export default function SalaryChart({ data }) {
  if (!data || data.length === 0) {
    return <p>Loading chart...</p>;
  }

  // group salary by city
  const citySalary = {};

  data.forEach((emp) => {
    const city = emp.city;

    const salary = parseInt(emp.salary.replace(/[$,]/g, ""));

    if (!citySalary[city]) {
      citySalary[city] = 0;
    }

    citySalary[city] += salary;
  });

  const chartData = Object.entries(citySalary);

  const maxSalary = Math.max(...chartData.map((d) => d[1]));

  const chartHeight = 350;
  const chartWidth = chartData.length * 120;

  return (
    <div className="overflow-x-auto border p-4 bg-white rounded shadow">
      <svg width={chartWidth} height={chartHeight}>
        {chartData.map(([city, salary], index) => {
          const barHeight = (salary / maxSalary) * 250;

          return (
            <g key={city}>
              {/* BAR */}

              <rect
                x={index * 120 + 20}
                y={chartHeight - barHeight - 40}
                width="80"
                height={barHeight}
                fill="#3b82f6"
                rx="4"
              />

              {/* SALARY VALUE */}

              <text
                x={index * 120 + 60}
                y={chartHeight - barHeight - 50}
                textAnchor="middle"
                fontSize="11"
                fill="#333"
              >
                ${(salary / 1000).toFixed(0)}k
              </text>

              {/* CITY LABEL */}

              <text
                x={index * 120 + 60}
                y={chartHeight - 10}
                textAnchor="middle"
                fontSize="12"
              >
                {city}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
