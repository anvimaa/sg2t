const ctx = document.getElementById("chart1");
new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Pontos", "Utentes", "Bairros", "Licenças"],
    datasets: [
      {
        label: "# total",
        data: [mark, ut, bar, lic],
        borderWidth: 1,
        backgroundColor: ["#16acde", "#38c94c", "#d6b627", "#de342a"],
        labelColor: "red",
      },
    ],
  },
  options: {
    scales: {
      x: {
        grid: {
          color: "#de342a",
        },
      },
      y: {
        grid: {
          color: "#de342a",
        },
      },
    },
  },
});
