import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Controls from "../components/Controls.react";
import HistoryTab from "../components/HistoryTab.react";
import ColoursCubeTab from "../components/ColoursCubeTab.react";
import CurrentLoadTab from "../components/CurrentLoadTab.react";
import { Tabs } from 'antd';
import 'antd/dist/antd.css';
import { Layout } from 'antd';
import { Card } from 'antd';
const { Header, Footer, Content } = Layout;
const { TabPane } = Tabs;
import React, { useEffect, useState } from 'react';
import { generateTopology } from '../algorithms/TopologyGenerator';
import { diffusionSync } from '../algorithms/diffussionSync';
import { diffusionAsync } from '../algorithms/diffussionAsync';
import { NNAAsync } from '../algorithms/NNAAsync';
import { NNASync } from '../algorithms/NNASync';
import 'three';


export default function Home() {
  const [topologySize, setTopologySize] = useState({ x: 5, y: 1, z: 1 });
  const [started, setStarted] = useState(false);
  const [allProcesors, setAllProcessors] = useState(generateTopology(topologySize.x, topologySize.y, topologySize.z));
  const [history, setHistory] = useState([]);
  const [diffusion, setDiffusion] = useState(80);
  const [speed, setSpeed] = useState(100);
  const [algorithmKey, setAlgorithm] = useState('diffusion_sync');
  const sumOfTasks = allProcesors.reduce((acc, processor) => {
    acc += processor.currentLoad
    return acc;
  }, 0);
  const avgTasks = Math.floor(sumOfTasks / allProcesors.length);
  let timeout = null;

  // ASYNC DIFFUSION
  useEffect(() => {
    if (started) {
      const algorithm = pickAlgorithm(algorithmKey);
      timeout = setTimeout(() => {
        const newProcessors = algorithm(allProcesors, diffusion / 100);
        setAllProcessors(newProcessors);
      }, 10500 - (100 * speed));
    } else {
      clearTimeout(timeout);
    }
  }, [started, allProcesors])

  useEffect(() => {
    setHistory([...history, allProcesors]);
  }, [allProcesors])

  const onStartSimulation = (started) => {
    setStarted(started);
  }
  const getFormValue = (formValues, key) => {
    return formValues.find(({ name }) => name[0] === key).value;
  }

  const pickAlgorithm = (algorithmKey) => {
    switch (algorithmKey) {
      case 'diffusion_sync':
        return diffusionSync;
      case 'diffusion_async':
        return diffusionAsync;
      case 'nna_async':
        return NNAAsync;
      case 'nna_sync':
        return NNASync;

      default:
        break;
    }
  }


  const onChangeValues = (value) => {
    const topology = {
      x: +getFormValue(value, 'size-x'),
      y: +getFormValue(value, 'size-y'),
      z: +getFormValue(value, 'size-z'),
    }
    setTopologySize(topology);
    setAlgorithm(getFormValue(value, 'algorithm'))
    setDiffusion(getFormValue(value, 'diffusion'))
    setSpeed(getFormValue(value, 'speed'))
    if (topology.x !== topologySize.x || topology.y !== topologySize.y || topology.z !== topologySize.z) {
      setAllProcessors(generateTopology(topology.x, topology.y, topology.z));
    }
  }

  const onChangeProcessor = (processorToEdit) => {
    const editedProcessors = allProcesors.map((processor) => {
      if (processorToEdit.id === processor.id) {
        return {
          ...processor,
          currentLoad: processorToEdit.currentLoad
        }
      } else {
        return {
          ...processor,
          neighbours: processor.neighbours.map((neighbour) => {
            if (neighbour.id === processorToEdit.id) {
              return {
                ...neighbour,
                currentLoad: processorToEdit.currentLoad 
              }
            }
            return neighbour;
          }),
        }
      }
    })
    setAllProcessors(editedProcessors);
  }

  const clearHistory = () => {
    setHistory([]);
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
            <h3>{Math.floor(sumOfTasks)} : {avgTasks}</h3>
          </Card>
        </div>
      </Content>
      <Content>
        <div className={styles.container}>
          <Card>
            <Tabs defaultActiveKey="1">
              <TabPane tab="Current Load" key="1">
                <CurrentLoadTab processors={allProcesors} onChangeProcessor={onChangeProcessor} />
              </TabPane>
              <TabPane tab="History Load" key="2">
                <HistoryTab onClearHistory={clearHistory} history={history} />
              </TabPane>
              <TabPane tab="Coloured" key="3">
                <ColoursCubeTab
                  processors={allProcesors}
                  size={topologySize}
                  avgTasks={avgTasks}
                  maxTasks={Math.floor(avgTasks * 2)}
                />
              </TabPane>
            </Tabs>
          </Card>
        </div>
      </Content>
    </Layout>
  )
}
