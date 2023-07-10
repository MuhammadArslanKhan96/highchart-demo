import { months } from "./../data/months";
import { ChannelsTypes } from "./../types/channels";
import { MessagesTypes } from "@/types/mesage";

export function engagementHelper(
  messages: MessagesTypes[],
  channels: ChannelsTypes[]
) {
  let timings: string[] = [];
  let data = channels
    .map((c) => ({
      ...c,
      data: messages
        .filter((i) => i.channelId === (c.id || c.value))
        .map((i) => Number(i.count)),
      timings: [
        ...messages
          .filter((i) => i.channelId === (c.id || c.value))
          .map((i) => i.timeBucket),
      ],
      type: 0,
    }))
    .filter(
      (i) =>
        i.data.length &&
        i.timings.filter(
          (date) =>
            new Date(date).toDateString() !==
            new Date(i.timings[0]).toDateString()
        ).length
    );
  for (var c of data) {
    let newTimings = [...timings, ...c.timings];
    timings = newTimings
      .filter(
        (i) =>
          !timings.filter(
            (item) =>
              new Date(item).toDateString() === new Date(i).toDateString()
          ).length
      )
      .sort(function (a, b) {
        return new Date(b).getTime() - new Date(a).getTime();
      });
  }

  // Convert dates to Date objects
  var dateObjects: any[] = timings.map((date) => new Date(date));

  // Find the minimum and maximum dates
  var minDate = new Date(Math.min(...dateObjects));
  var maxDate = new Date(Math.max(...dateObjects));

  // Generate an array of missing dates
  var missingDates = [];
  var currentDate = new Date(minDate);

  while (currentDate <= maxDate) {
    var formattedDate = currentDate.toISOString();
    if (!timings.includes(formattedDate)) {
      missingDates.push(formattedDate);
    }
    currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
  }

  timings = [...timings, ...missingDates];
  let options = {
    title: {
      text: null,
    },
    chart: {
      type: "spline",
    },
    colors: ["#009091"],
    plotOptions: {
      series: {
        connectNulls: true,
        label: {
          connectorAllowed: true,
        },
        marker: {
          lineWidth: 4,
        },
      },
    },
    series: data,

    yAxis: {
      title: {
        text: null,
      },
      accessibility: {
        description: "Percent unemployment of labor force",
      },
      labels: {
        format: "{text} -",
      },
      grid: null,
    },
    xAxis: {
      categories: timings
        .sort(function (a, b) {
          return new Date(b).getTime() - new Date(a).getTime();
        })
        .map((i) => `${new Date(i).toISOString()}`),
    },
    tooltip: {
      shared: true,
      crosshairs: true,
      headerFormat:
        "<p style='font-weight: bold; color: white;'>{point.series.name}</p><br />",
      pointFormat: `<p style='font-size: 11px; font-weight: normal; color: white; opacity: 90%;'>{point.y} messages on {point.category}</p>`,
    },
  };

  // Reorder the data based on timings and x-axis categories
  options.series.forEach(function (series) {
    var data = series.data;
    var timings = series.timings;

    var reorderedData: any[] = [];
    var newXAxisData: string[] = [];
    options.xAxis.categories.forEach(function (category) {
      var index = timings.findIndex(function (timing) {
        return new Date(timing).toISOString() === category;
      });
      if (index !== -1) {
        reorderedData.push(data[index]);
      } else {
        reorderedData.push(null);
      }
    });

    series.data = reorderedData;
    options.xAxis.categories.forEach(function (category) {
      newXAxisData.push(
        `${new Date(category).getDate()} ${
          months[new Date(category).getMonth()]
        }`
      );
    });
    options.xAxis.categories = newXAxisData;
  });
  return options;
}
