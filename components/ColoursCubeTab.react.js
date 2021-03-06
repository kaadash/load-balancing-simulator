import React, { useState, useEffect, useRef } from "react";
import { Topology3DView } from "./Topology3DView";
import styles from "../styles/Home.module.css";

export default (props) => {
  // Zadeklaruj nową zmienną stanu, którą nazwiemy „count”
  const rootElement = useRef(null);
  const [processorTooltip, setProcessorTooltip] = useState({
    id: "",
    currentLoad: "",
  });
  const [topology3DView, setTopology3DView] = useState(null);

  useEffect(() => {
    setTopology3DView(
      new Topology3DView(
        rootElement.current,
        props.processors,
        props.maxTasks,
        props.size
      )
    );
    return () => {
      rootElement.current.innerHTML = "";
    };
  }, []);

  useEffect(() => {
    if (topology3DView) {
      topology3DView.updateProcessors(props.processors, props.maxTasks);
      topology3DView.changeSpheresColors();
    }
  }, [props.processors, props.maxTasks]);

  useEffect(() => {
    if (topology3DView) {
      topology3DView.updateProcessors(props.processors, props.maxTasks);
      topology3DView.removeAll();
      topology3DView.renderSpheres();
      topology3DView.renderLines();
    }
  }, [props.size]);

  return (
    <div>
      <div className="row">
        <div className="gradient-legend">
          <p>load over average</p>
          <div className="gradient-column"></div>
          <p>load under average</p>
        </div>
        <div className={styles.colorCubesContainer} ref={rootElement}></div>
      </div>
    </div>
  );
};
