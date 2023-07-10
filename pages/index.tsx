import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { engagementHelper } from '@/helper/chartOptions'
import { messages } from '@/data/messages'
import { channels } from '@/data/channels'
const Home = () => {
  const options = engagementHelper(
    messages,
    channels

  )
  return <HighchartsReact highcharts={Highcharts} options={options} />
}

export default Home