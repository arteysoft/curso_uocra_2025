// Integración con main.js usando el sistema de eventos
document.addEventListener('DOMContentLoaded', () => {

  let tiempo = async () => {
    return await new Promise((next) => { setTimeout(next, 1000)  })
  }

  document.getElementById('btnArrancar').addEventListener('click', async () => { 
     await tiempo()
     dibujarConApiGoogleChart([
          ['Year', 'Sales', 'Expenses'],
          ['2004',  8600,      6400],
          ['2005',  1170,      460],
          ['2006',  660,       1120],
          ['2007',  1030,      20000]
        ])
  })

  let dibujarConApiGoogleChart = (dataArray) => {
    google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart);

      function drawChart() {
        var data = google.visualization.arrayToDataTable(dataArray);

        var options = {
          title: 'Company Performance',
          curveType: 'function',
          legend: { position: 'bottom' }
        };

        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

        chart.draw(data, options);
      }
  }
})

