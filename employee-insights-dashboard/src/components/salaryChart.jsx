export default function SalaryChart({ data }) {
  if (!data.length) return <p>Loading chart...</p>;

  const cities = {};

  data.forEach((emp) => {
    const city = emp.city;

    const salary = parseInt(emp.salary.replace(/[$,]/g, ""));

    if (!cities[city]) cities[city] = 0;

    cities[city] += salary;
  });

  const chartData = Object.entries(cities);

  const maxSalary = Math.max(...chartData.map((d) => d[1]));

  const chartWidth = chartData.length * 120;
  const chartHeight = 320;

  return (
    <div className="overflow-x-auto">
      <svg width={chartWidth} height={chartHeight}>
        {chartData.map(([city, salary], i) => {
          const barHeight = (salary / maxSalary) * 250;

          return (
            <g key={city}>
              <rect
                x={i * 120 + 20}
                y={chartHeight - barHeight - 40}
                width="80"
                height={barHeight}
                fill="#3b82f6"
                rx="4"
              />

              <text
                x={i * 120 + 60}
                y={chartHeight - 15}
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
