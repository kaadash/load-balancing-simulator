import React, { useEffect, useState } from "react";
import { BarCanvas } from "@nivo/bar";
import { Divider, Table, Modal, Button, InputNumber } from "antd";

export const CurrentLoadTab = (props) => {
  const [chartValues, setChartValues] = useState([]);

  const onChangeLoad = (load, processor) => {
    console.log("onChangeLoad", load, processor);
    props.onChangeProcessor({
      ...processor,
      currentLoad: load,
    });
  };

  const tableHeader = [
    { title: "Processor ID", dataIndex: "id", key: "1" },
    {
      title: "Current load",
      dataIndex: "currentLoad",
      key: "2",
      render: (currentLoad, processor) => {
        return (
          <InputNumber
            min={0}
            value={currentLoad}
            disabled={props.started}
            defaultValue={currentLoad}
            onChange={(load) => onChangeLoad(load, processor)}
          />
        );
      },
    },
    {
      title: "Action",
      key: "key",
      fixed: "right",
      width: 200,
      render: (_, record) => (
        <Button disabled={props.started} onClick={() => clearTasks(record)}>Clear</Button>
      ),
    },
  ];
  const clearTasks = (processor) => {
    props.onChangeProcessor({
      ...processor,
      currentLoad: 0,
    });
  };
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    setChartValues(
      (props.processors || []).map((processor) => {
        return {
          id: processor.id,
          processor: processor.id,
          load: processor.currentLoad,
        };
      })
    );
    setTableData(
      (props.processors || []).map((processor) => {
        return {
          id: processor.id,
          key: processor.id,
          currentLoad: Math.floor(processor.currentLoad),
        };
      })
    );
  }, [props.processors]);
  return (
    <div>
      <div>
        <Table
          columns={tableHeader}
          dataSource={tableData}
          scroll={{ x: 1300 }}
        />
      </div>
      <div>
        <Divider>Processor Load Histogram</Divider>
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
      </div>
    </div>
  );
};

export default CurrentLoadTab;
