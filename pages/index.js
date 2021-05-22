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
import React, { useEffect, useState } from 'react';
import { generateTopology } from '../algorithms/TopologyGenerator';
import { diffusionSync } from '../algorithms/diffustionSync';
import 'three';


export default function Home() {
  const [topologySize, setTopologySize] = useState({ x: 5, y: 1, z: 1 });
  const [started, setStarted] = useState(false);
  const [allProcesors, setAllProcessors] = useState(generateTopology(topologySize.x, topologySize.y, topologySize.z));
  const [history, setHistory] = useState([]);
  const sumOfTasks = allProcesors.reduce((acc, processor) => {
    acc += processor.currentLoad
    return acc;
  }, 0);
  const avgTasks = Math.floor(sumOfTasks / allProcesors.length);
  // ASYNC DIFFUSION
  const diffusion = 1;
  useEffect(() => {
    let interval = null;
    setTimeout(() => {
      const newProcessors = diffusionSync(allProcesors, diffusion);
      setAllProcessors(newProcessors);
    }, 1000);
    if (started) {
      clearTimeout(interval);
    } else {
    }
  }, [allProcesors])

  useEffect(() => {
    setHistory([...history, allProcesors]);
    console.log(history);
  }, [allProcesors])

  const onStartSimulation = (started, formData) => {
    // setStarted(started);
  }
  const getFormValue = (formValues, key) => {
    return formValues.find(({ name }) => name[0] === key).value;
  }


  const onChangeValues = (value) => {

    const topology = {
      x: +getFormValue(value, 'size-x'),
      y: +getFormValue(value, 'size-y'),
      z: +getFormValue(value, 'size-z'),
    }
    setTopologySize(topology);

    setAllProcessors(generateTopology(topologySize.x, topologySize.y, topologySize.z));
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
            <Controls onStart={onStartSimulation} onChangeValues={onChangeValues} started={started} />
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
                <HistoryTab history={history} />
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
