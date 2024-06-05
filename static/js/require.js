// Get the CSV file
fetch("static/assets/csv/pivoted_data.csv")
  .then((response) => response.text())
  .then((data) => {
    const pdf = Plotly.d3.csv.parse(data);
    console.log(pdf[0]);
    // Create line plot
    const line = {
      data: [
        {
          x: pdf.map((row) => row.DATE),
          y: pdf.map((row) => row.java),
          name: "Java",
          type: "line",
        },
        {
          x: pdf.map((row) => row.DATE),
          y: pdf.map((row) => row.python),
          name: "Python",
          type: "line",
        },
      ],
      layout: {
        title: {
          text: "Posts Over Time",
          font: {
            size: 20,
          },
        },
        xaxis: {
          title: "Date",
          showgrid: false,
          tickfont: {
            size: 12,
          },
        },
        yaxis: {
          title: "Number of Posts",
          showgrid: false,
          tickfont: {
            size: 12,
          },
          range: [0, 35000],
        },
        font: {
          family: "Verdana",
        },
        autosize: true,
      },
      config: {
        responsive: true,
      },
    };
    // Create scatter plot
    const columns = Object.keys(pdf[0]).filter((col) => col !== "DATE");

    const scatter = {
      data: [],
      layout: {
        autosize: true,
        title: {
          text: "Posts Over Time",
          font: {
            size: 20,
          },
        },
        xaxis: {
          title: "Date",
          showgrid: false,
          tickfont: {
            size: 12,
          },
        },
        yaxis: {
          title: "Number of Posts",
          showgrid: false,
          tickfont: {
            size: 12,
          },
          range: [0, 35000],
        },
        legend: {
          orientation: "h",
          yanchor: "top",
          y: -0.2,
          xanchor: "center",
          x: 0.5,
          font: {
            size: 10,
          },
        },
        margin: {
          l: 50,
          r: 20,
          t: 40,
          b: 80,
        },
        plot_bgcolor: "rgba(0, 0, 0, 0)",
        paper_bgcolor: "rgba(0, 0, 0, 0)",
        font: {
          family: "Verdana",
        },
      },
      config: {
        responsive: true,
      },
    };

    // Create traces for each column
    columns.map((column) => {
      scatter.data.push({
        x: pdf.map((row) => row.DATE),
        y: pdf.map((row) => row[column]),
        mode: "lines",
        name: column,
        type: "scatter",
      });
    });

    const lineElement = document.getElementById("chart1");
    const scatterElement = document.getElementById("chart2");

    Plotly.plot(lineElement, line.data, line.layout, line.config);
    Plotly.plot(scatterElement, scatter.data, scatter.layout, scatter.config);
  });
