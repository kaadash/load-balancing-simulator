import React, { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar'
import {
  Radio,
  Table
} from 'antd';

export const CurrentLoadTab = (props) => {
  const [chartKeys, setChartKeys] = useState([]);
  const [chartValues, setChartValues] = useState([]);
  const [tableHeader, setTableHeader] = useState([
    { title: 'Processor ID', dataIndex: 'id', key: '1' },
    { title: 'Current load', dataIndex: 'currentLoad', key: '2' },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 200,
      render: () => <a>Change current load</a>,
    },
  ]);
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    setChartKeys((props.processors || []).map(processor => processor.id));
    setChartValues([(props.processors || []).reduce((acc, processor) => {
      acc[processor.id] = processor.currentLoad;
      return acc;
    }, {})]);
    setTableData((props.processors || []).map((processor) => {
      return {
        id: processor.id,
        currentLoad: processor.currentLoad,
      }
    }));
  }, [props.processors]);
  return (
    <div>
      <Radio.Group>
        <Radio.Button value="table">table</Radio.Button>
        <Radio.Button value="graph">graph</Radio.Button>
      </Radio.Group>

      <div>
        <Table columns={tableHeader} dataSource={tableData} scroll={{ x: 1300 }} />
      </div>
      <div style={{ height: '300px', width: '1300px', }}>
        <ResponsiveBar
          data={chartValues}
          groupMode="grouped"
          keys={chartKeys}
          indexBy="country"
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
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      </div>
    </div>
  )
}

export default CurrentLoadTab;