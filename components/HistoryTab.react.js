import React, { useEffect, useState } from 'react';
import { BarCanvas } from '@nivo/bar'
import { Pagination, Button, Select } from 'antd';

const { Option } = Select;

export const HistoryTab = (props) => {
  const [currentStateIndex, setCurrentStateIndex] = useState(0);
  const [currentProcessorsState, setCurrentProcessorsState] = useState(null);
  const [chartValues, setChartValues] = useState([]);
  const [selectedProcessor, setSelectedProcessor] = useState(null);
  const [selectedProcessorHistory, setSelectedProcessorHistory] = useState([]);

  const onChange = (value) => {
    setCurrentStateIndex(value - 1);
    setCurrentProcessorsState(props.history[value - 1])
  };

  const handleChangeProcessor = (processor) => {
    setSelectedProcessor(processor);
    const processorHistory = (props.history || []).map((historyItem, index) => {
      const processorFromHistory = historyItem.find(({ id }) => id === processor);
      return {
        id: index,
        processor: index,
        load: processorFromHistory.currentLoad,
      }
    })
    console.log(processorHistory);
    setSelectedProcessorHistory(processorHistory);
  };

  const renderOptions = () => {
    return (props.processors || []).map((processor) => {
      return <Option value={processor.id}>{processor.id}</Option>
    });
  }

  useEffect(() => {
    setChartValues(
      (currentProcessorsState || [])
        .map((processor) => {
          return {
            id: processor.id,
            processor: processor.id,
            load: processor.currentLoad,
          };
        })
    );
  }, [currentProcessorsState]);

  return (
    <div>
      {props.history && props.history.length ? (
        <div>
          <div>
            <p>Select processor to check its history</p>
            <Select   style={{ width: 120 }} onChange={handleChangeProcessor}>
              {renderOptions()}
            </Select>
          </div>
          <Pagination pageSize={1} current={currentStateIndex + 1} total={props.history.length} onChange={onChange} />
          <div>
            {
              selectedProcessor ? (
                <BarCanvas
                  data={selectedProcessorHistory}
                  keys={["load"]}
                  axisLeft={{
                    legend: "Current Load",
                    legendPosition: "middle",
                    legendOffset: -40,
                  }}
                  margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                  labelSkipWidth={0}
                  labelSkipHeight={0}
                  isInteractive={true}
                  width={1250}
                  height={300}
                  labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                  animate={false}
                />
              ) : (
                <BarCanvas
                  data={chartValues}
                  keys={["load"]}
                  axisLeft={{
                    legend: "Current Load",
                    legendPosition: "middle",
                    legendOffset: -40,
                  }}
                  margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                  labelSkipWidth={0}
                  labelSkipHeight={0}
                  isInteractive={true}
                  width={1250}
                  height={300}
                  labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                  animate={false}
                />
              )
            }
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