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
      .filter((i) => !timings.includes(i))
      .sort(function (a, b) {
        return new Date(b).getTime() - new Date(a).getTime();
      });
  }

  let options = {
    title: {
      text: null,
    },
    chart: {
      type: "spline",
    },
    sonification: {
      duration: 27000,
      afterSeriesWait: 1200,
      defaultInstrumentOptions: {
        instrument: "basic2",
        mapping: {
          playDelay: 500,
        },
      },
    },
    accessibility: {
      screenReaderSection: {
        axisRangeDateFormat: "%B %Y",
        beforeChartFormat: "",
      },
      point: {
        dateFormat: "%b %e, %Y",
        valueDescriptionFormat: "{value}{separator}{xDescription}",
      },
      series: {
        pointDescriptionEnabledThreshold: false,
      },
    },
    plotOptions: {
      series: {
        label: {
          connectorAllowed: true,
        },
        marker: {
          lineWidth: 4,
        },
        cropThreshold: 10,
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
      accessibility: {
        description: "Percent unemployment of labor force",
      },
      categories: timings.map(
        (i) => `${new Date(i).getDate()} ${months[new Date(i).getUTCMonth()]}`
      ),
    },
    tooltip: {
      shared: true,
      crosshairs: true,
      headerFormat: "{point.series.name}<br />",
      pointFormat: `{point.y} messages on {point.category}`,
    },
  };
  return options;
}
