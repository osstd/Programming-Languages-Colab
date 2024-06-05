async function fetchCSVData(url) {
  const response = await fetch(url);
  const data = await response.text();
  return data;
}

async function plotLine(data, title, num) {
  const pdf = Plotly.d3.csv.parse(data);

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
        text: `${title}`,
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

  const lineElement = document.getElementById(`chart${num}`);

  Plotly.plot(lineElement, line.data, line.layout, line.config);
}

async function plotScatter(data, title, num) {
  const pdf = Plotly.d3.csv.parse(data);

  // Create scatter plot
  const columns = Object.keys(pdf[0]).filter((col) => col !== "DATE");

  const scatter = {
    data: [],
    layout: {
      autosize: true,
      title: {
        text: `${title}`,
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

  const scatterElement = document.getElementById(`chart${num}`);

  Plotly.plot(scatterElement, scatter.data, scatter.layout, scatter.config);
}

async function main() {
  const startTime = performance.now();
  try {
    const pivotedData = await fetchCSVData(
      "static/assets/csv/pivoted_data.csv"
    );
    const rompdfw6Data = await fetchCSVData("static/assets/csv/rompdfw6.csv");
    const rompdfw12Data = await fetchCSVData("static/assets/csv/rompdfw12.csv");

    // Run plotting functions concurrently
    await Promise.all([
      plotLine(pivotedData, "Posts Over Time", 1),
      plotScatter(pivotedData, "Posts Over Time", 2),
      plotScatter(rompdfw6Data, "Posts Over Time Smooth", 3),
      plotScatter(rompdfw12Data, "Posts Over Time Smooth", 4),
    ]);
  } catch (error) {
    console.error("Error loading or plotting data:", error);
  } finally {
    const endTime = performance.now();
    console.log(`Execution time: ${endTime - startTime}ms`);
  }
}

document.addEventListener("DOMContentLoaded", main);
