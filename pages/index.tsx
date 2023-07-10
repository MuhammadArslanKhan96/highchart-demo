import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { engagementHelper } from '@/helper/chartOptions'
import { messages } from '@/data/messages'
import { channels } from '@/data/channels'
import { useEffect, useState } from "react";
const Home = () => {
  const [options, setOptions] = useState();

  function getOptions() {
    const options: any = engagementHelper(
      messages,
      channels
    );
    setOptions(options)
  }

  useEffect(() => {
    getOptions()
  }, [])

  if (!options) return;
  return <HighchartsReact highcharts={Highcharts} options={options} />
}

export default Home