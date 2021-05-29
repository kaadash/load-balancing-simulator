import React, { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar'
import { Pagination, Button } from 'antd';

export const HistoryTab = (props) => {
  const [currentStateIndex, setCurrentStateIndex] = useState(0);
  const [currentProcessorsState, setCurrentProcessorsState] = useState(null);
  const [chartKeys, setChartKeys] = useState([]);
  const [chartValues, setChartValues] = useState([]);

  const onChange = (value) => {
    setCurrentStateIndex(value - 1);
    setCurrentProcessorsState(props.history[value - 1])
  };

  useEffect(() => {
    setChartKeys((currentProcessorsState || []).map(processor => processor.id));
    setChartValues([(currentProcessorsState || []).reduce((acc, processor) => {
      acc[processor.id] = Math.floor(processor.currentLoad);
      return acc;
    }, {})]);
  }, [currentProcessorsState]);

  return (
    <div>
      {props.history && props.history.length ? (
        <div>
          <Pagination pageSize={1} current={currentStateIndex + 1} total={props.history.length} onChange={onChange} />
          <div style={{ height: '300px', width: '1300px', }}>
            <ResponsiveBar
              data={chartValues}
              groupMode="grouped"
              keys={chartKeys}
              margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
              colors={{ scheme: 'nivo' }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'load',
                legendPosition: 'middle',
                legendOffset: -40
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              isInteractive={true}
              labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              animate={false}
              motionStiffness={90}
              motionDamping={15}
            />
          </div>
          <Button onClick={props.onClearHistory}>Clear History</Button>
        </div>
      )
        : (
          <div>History is empty</div>
        )
      }

    </div>
  );
}

export default HistoryTab;