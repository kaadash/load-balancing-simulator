import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Controls from "./Controls.react";
import HistoryTab from "./HistoryTab.react";
import ColoursCubeTab from "./ColoursCubeTab.react";
import CurrentLoadTab from "./CurrentLoadTab.react";
import { Tabs } from 'antd';
import 'antd/dist/antd.css';
import { Layout } from 'antd';
import { Card } from 'antd';
const { Header, Footer, Content } = Layout;
const { TabPane } = Tabs;
import { generateTopology } from './TopologyGenerator'

export default function Home() {
  const allProcesors = generateTopology(3, 3, 3);
  console.log(allProcesors.map(processor => processor.currentLoad));
  // ASYNC DIFFUSION
  // const diffusion = 0.2;
  // setInterval(() => {
  //   allProcesors.forEach((processor) => {
  //     processor.neighbours.forEach(neighbourProcess => {
  //       const diff = processor.currentLoad - neighbourProcess.currentLoad;
  //       const absDiff = Math.abs(diff);
  //       const loadToTransfer = Math.floor(diffusion * absDiff);
  //       if (diff > 0) {
  //         processor.currentLoad = processor.currentLoad - loadToTransfer;
  //         neighbourProcess.currentLoad = neighbourProcess.currentLoad + loadToTransfer;
  //       } else {
  //         neighbourProcess.currentLoad = neighbourProcess.currentLoad - loadToTransfer;
  //         processor.currentLoad = processor.currentLoad + loadToTransfer;
  //       }
  //     })
  //   })
  //   console.log(allProcesors.map(processor => processor.currentLoad));
  // }, 3000);
  
  // SECOND DIFFUSION
  const diffusion = 0.9;
  // setInterval(() => {
  //   allProcesors.forEach((processor) => {
  //     processor.neighbours.forEach(neighbourProcess => {
  //       const diff = processor.currentLoad - neighbourProcess.currentLoad;
  //       const absDiff = Math.abs(diff);
  //       const loadToTransfer = Math.floor(diffusion * absDiff);
  //       if (diff > 0) {
  //         processor.currentLoad = processor.currentLoad - loadToTransfer;
  //         neighbourProcess.currentLoad = neighbourProcess.currentLoad + loadToTransfer;
  //       } else {
  //         neighbourProcess.currentLoad = neighbourProcess.currentLoad - loadToTransfer;
  //         processor.currentLoad = processor.currentLoad + loadToTransfer;
  //       }
  //     })
  //   })
  //   console.log(allProcesors.map(processor => processor.currentLoad));
  // }, 3000);
  return (
    <Layout>
      <Head>
        <title>Load balancing simulator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Content>
        <div className={styles.container}>
          <Card>
            <Controls />
          </Card>
        </div>
      </Content>
      <Content>
        <div className={styles.container}>
          <Card>
            <Tabs defaultActiveKey="1">
              <TabPane tab="Current Load" key="1">
                <CurrentLoadTab />
              </TabPane>
              <TabPane tab="History Load" key="2">
                <HistoryTab />
              </TabPane>
              <TabPane tab="Coloured" key="3">
                <ColoursCubeTab processors={allProcesors} />
              </TabPane>
            </Tabs>
          </Card>
        </div>
      </Content>
    </Layout>
  )
}
