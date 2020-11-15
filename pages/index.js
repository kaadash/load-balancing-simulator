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
import React, { useState } from 'react';
import { generateTopology } from './TopologyGenerator'
import 'three';


export default function Home() {
  const [topologySize, setTopologySize] = useState({x: 10, y: 3, z: 3});
  const [started, setStarted] = useState(false);
  const [allProcesors, setAllProcessors] = useState(generateTopology(topologySize.x, topologySize.y, topologySize.z));
  const sumOfTasks = allProcesors.reduce((acc, processor) => {
    acc += processor.currentLoad
    return acc;
  }, 0);
  const avgTasks = Math.floor(sumOfTasks / allProcesors.length);
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

  const onStartSimulation = (started, formData) => {
    console.log('onStartSimulation', formData);
    setStarted(started);
  }

  return (
    <Layout>
      <Head>
        <title>Load balancing simulator</title>
        <link rel="icon" href="/favicon.ico" />
        <script defer src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r122/three.min.js" integrity="sha512-bzjaf85dHTL4H0BvkAJ/Jbvxqf1rDj+jVpCNe3oxQj/RXSnkx1HnKhqIcmMWghxEAbXsYgddrc38saWpltlkug==" crossorigin="anonymous"></script>
      </Head>
      <Content>
        <div className={styles.container}>
          <Card>
            <Controls onStart={onStartSimulation} started={started} />
          </Card>
        </div>
      </Content>
      <Content>
        <div className={styles.container}>
          <Card>
            <Tabs defaultActiveKey="1">
              <TabPane tab="Current Load" key="1">
                <CurrentLoadTab processors={allProcesors} />
              </TabPane>
              <TabPane tab="History Load" key="2">
                <HistoryTab />
              </TabPane>
              <TabPane tab="Coloured" key="3">
                <ColoursCubeTab
                  processors={allProcesors}
                  size={topologySize}
                  avgTasks={avgTasks}
                  maxTasks={1000}
                />
              </TabPane>
            </Tabs>
          </Card>
        </div>
      </Content>
    </Layout>
  )
}
