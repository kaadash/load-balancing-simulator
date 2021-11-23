import Head from "next/head";
import styles from "../styles/Home.module.css";
import Controls from "../components/Controls.react";
import HistoryTab from "../components/HistoryTab.react";
import ColoursCubeTab from "../components/ColoursCubeTab.react";
import CurrentLoadTab from "../components/CurrentLoadTab.react";
import { Tabs } from "antd";
import "antd/dist/antd.css";
import { Layout } from "antd";
import { Card } from "antd";
const { Header, Footer, Content } = Layout;
const { TabPane } = Tabs;
import React, { useEffect, useState } from "react";
import { generateTopology } from "../algorithms/TopologyGenerator";
import { diffusionSync } from "../algorithms/diffussionSync";
import { diffusionAsync } from "../algorithms/diffussionAsync";
import { NNAAsync } from "../algorithms/NNAAsync";
import { NNASync } from "../algorithms/NNASync";
// import data from './dataCurrent';
// import data from './historyLoadData';
import data from './colourCubeData';
import _ from 'lodash';
import "three";


const grouped = _.groupBy(data, 'processors');

const results = _.map(grouped, (item) => {
	return {
    processor: item[0].processors,
    time: _.sumBy(item, 'time') / item.length
  };
})

console.log(results);

if (typeof window !== "undefined") {
  window.historyValues = {
    0: [],
    1: [],
    2: [],
  };
  window.indexFrames = [];
}

let start = null;

export default function Home() {
  const [topologySize, setTopologySize] = useState({ x: 10, y: 10, z: 10 });
  const [started, setStarted] = useState(false);
  const [allProcesors, setAllProcessors] = useState(
    generateTopology(topologySize.x, topologySize.y, topologySize.z)
  );
  const [history, setHistory] = useState([]);
  const [diffusion, setDiffusion] = useState(80);
  const [speed, setSpeed] = useState(100);
  const [algorithmKey, setAlgorithm] = useState("diffusion_sync");
  const sumOfTasks = allProcesors.reduce((acc, processor) => {
    acc += processor.currentLoad;
    return acc;
  }, 0);
  const avgTasks = Math.floor(sumOfTasks / allProcesors.length);
  let timeout = null;

  // ASYNC DIFFUSION
  useEffect(() => {
    if (started) {
      const algorithm = pickAlgorithm(algorithmKey);
      timeout = setTimeout(() => {
        const processorsAfterRandomLoadChange = randomRange(allProcesors);
        const newProcessors = algorithm(
          processorsAfterRandomLoadChange,
          diffusion / 100
        );
        if (typeof window !== "undefined") {
          // console.log('newProcessors', newProcessors);
          // window.historyValues[0].push(Math.floor(newProcessors[0].currentLoad));
          // window.historyValues[1].push(Math.floor(newProcessors[1].currentLoad));
          // window.historyValues[2].push(Math.floor(newProcessors[2].currentLoad));
        }
        setAllProcessors(newProcessors);
      }, 10500 - 100 * speed);
    } else {
      clearTimeout(timeout);
    }
  }, [started, allProcesors]);

  const [count, setCount] = React.useState(0)
  
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = React.useRef();
  const previousTimeRef = React.useRef();
  
  const animate = time => {
    console.log(allProcesors.length);
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current;
      if (started) {
        window.indexFrames.push({
          time: deltaTime,
          processors: allProcesors.length
        });
      }
      // Pass on a function to the setter of the state
      // to make sure we always have the latest state
      // setCount(prevCount => (prevCount + deltaTime * 0.01) % 100);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }
  
  React.useEffect(() => {
    cancelAnimationFrame(requestRef.current)
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [allProcesors, started]); // Make sure the effect runs only once

  useEffect(() => {
    setHistory([...history, allProcesors]);
  }, [allProcesors]);


  const randomRange = (processors) => {
    const newProcessors = processors.map((processor) => {
      if (processor.range) {
        const sign = Math.round(Math.random()) ? 1 : -1;
        const currentLoad = Math.round(
          Math.max(
            processor.currentLoad + sign * Math.random() * processor.range,
            0
          )
        );
        return {
          ...processor,
          currentLoad,
        };
      }
      return processor;
    });
    const newProcessorsWithNeighbours = newProcessors.map((processor) => {
      const updatedNeighbours = processor.neighbours.map((neighbour) => {
        const updatedNeighbour = newProcessors.find(
          ({ id }) => id === neighbour.id
        );
        return {
          ...neighbour,
          currentLoad: updatedNeighbour.currentLoad,
        };
      });
      return {
        ...processor,
        neighbours: updatedNeighbours,
      };
    });
    return newProcessorsWithNeighbours;
  };

  const onStartSimulation = (started) => {
    setStarted(started);
  };
  const getFormValue = (formValues, key) => {
    return formValues.find(({ name }) => name[0] === key).value;
  };

  const pickAlgorithm = (algorithmKey) => {
    switch (algorithmKey) {
      case "diffusion_sync":
        return diffusionSync;
      case "diffusion_async":
        return diffusionAsync;
      case "nna_async":
        return NNAAsync;
      case "nna_sync":
        return NNASync;

      default:
        break;
    }
  };

  const onChangeValues = (value) => {
    const topology = {
      x: +getFormValue(value, "size-x"),
      y: +getFormValue(value, "size-y"),
      z: +getFormValue(value, "size-z"),
    };
    setTopologySize(topology);
    setAlgorithm(getFormValue(value, "algorithm"));
    setDiffusion(getFormValue(value, "diffusion"));
    setSpeed(getFormValue(value, "speed"));
    if (
      topology.x !== topologySize.x ||
      topology.y !== topologySize.y ||
      topology.z !== topologySize.z
    ) {
      setAllProcessors(generateTopology(topology.x, topology.y, topology.z));
    }
  };

  const onChangeProcessor = (processorToEdit) => {
    const editedProcessors = allProcesors.map((processor) => {
      if (processorToEdit.id === processor.id) {
        return {
          ...processor,
          currentLoad: processorToEdit.currentLoad,
          range: processorToEdit.range || 0,
        };
      } else {
        return {
          ...processor,
          neighbours: processor.neighbours.map((neighbour) => {
            if (neighbour.id === processorToEdit.id) {
              return {
                ...neighbour,
                currentLoad: processorToEdit.currentLoad,
                range: processorToEdit.range || 0,
              };
            }
            return neighbour;
          }),
        };
      }
    });
    setAllProcessors(editedProcessors);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <Layout>
      <Head>
        <title>Load balancing simulator </title>
        <link rel="icon" href="/favicon.ico" />
        <script
          defer
          src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r122/three.min.js"
          integrity="sha512-bzjaf85dHTL4H0BvkAJ/Jbvxqf1rDj+jVpCNe3oxQj/RXSnkx1HnKhqIcmMWghxEAbXsYgddrc38saWpltlkug=="
          crossorigin="anonymous"
        ></script>
      </Head>
      <Content>
        <div className={styles.container}>
          <Card>
            <Controls
              onStart={onStartSimulation}
              onChangeValues={onChangeValues}
              started={started}
            />
          </Card>
        </div>
      </Content>
      <Content>
        <div className={styles.container}>
          <Card>
            <Tabs defaultActiveKey="3">
              <TabPane tab="Current Load" key="1">
                <CurrentLoadTab
                  processors={allProcesors}
                  started={started}
                  onChangeProcessor={onChangeProcessor}
                />
              </TabPane>
              <TabPane tab="Load history" key="2">
                <HistoryTab
                  onClearHistory={clearHistory}
                  history={history}
                  processors={allProcesors}
                />
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
  );
}
