  var data = [
    		{date: "12/27/2016", http_404: 2, http_200: 190, http_302: 100},
    		{date: "12/28/2016", http_404: 2, http_200: 10, http_302: 100},
    		{date: "12/29/2016", http_404: 1, http_200: 300, http_302: 200},
    		{date: "12/30/2016", http_404: 2, http_200: 90, http_302: 0},
    		{date: "12/31/2016", http_404: 2, http_200: 90, http_302: 0},
    		{date: "01/01/2017", http_404: 2, http_200: 90, http_302: 0},
    		{date: "01/02/2017", http_404: 1, http_200: 10, http_302: 1},
    		{date: "01/03/2017", http_404: 2, http_200: 90, http_302: 0},
    		{date: "01/04/2017", http_404: 2, http_200: 90, http_302: 0},
    		{date: "01/05/2017", http_404: 2, http_200: 90, http_302: 0},
    		{date: "01/06/2017", http_404: 2, http_200: 200, http_302: 1},
    		{date: "01/07/2017", http_404: 1, http_200: 200, http_302: 100}
  ];

  var ndx = crossfilter(data);
  var parseDate = d3.time.format("%m/%d/%Y").parse;
  data.forEach(function(d) {
	   d.date = parseDate(d.date);
	   d.total = d.http_404+d.http_200+d.http_302;
     d.Year = d.date.getFullYear();
  });


  var dateDim = ndx.dimension(function(d) {return d.date;});
  var hits = dateDim.group().reduceSum(dc.pluck('total'));
  var status_200 = dateDim.group().reduceSum(function(d) {return d.http_200;});
  var status_302 = dateDim.group().reduceSum(function(d) {return d.http_302;});
  var status_404 = dateDim.group().reduceSum(function(d) {return d.http_404;});
  var datatable = dc.dataTable("#dc-data-table");
  var yearDim = ndx.dimension(function(d) {return d.Year;});
  var year_total = yearDim.group().reduceSum(function(d) {return d.total;});

  var minDate = dateDim.bottom(1)[0].date;
  var maxDate = dateDim.top(1)[0].date;
  var hitslineChart = dc.lineChart("#chart-line-hitsperday");
  var yearRingChart = dc.pieChart("#chart-ring-year");

  datatable
      .dimension(dateDim)
      .group(function(d) {return d.Year;})
      // dynamic columns creation using an array of closures
      .columns([
          function(d) { return d.date.getDate() + "/" + (d.date.getMonth() + 1) + "/" + d.date.getFullYear(); },
          function(d) {return d.http_200;},
          function(d) {return d.http_302;},
          function(d) {return d.http_404;},
          function(d) {return d.total;}
      ]);

  hitslineChart
     .width(500).height(200)
     .dimension(dateDim)
     .group(status_200,"200")
     .stack(status_404,"404")
     .stack(status_302,"302")
     .renderArea(true)
     .x(d3.time.scale().domain([minDate,maxDate]))
     .legend(dc.legend().x(50).y(10).itemHeight(13).gap(5))
     .yAxisLabel("Hits per day");

  yearRingChart
      .width(150).height(150)
      .dimension(yearDim)
      .group(year_total)
      .innerRadius(30);

  dc.renderAll();
