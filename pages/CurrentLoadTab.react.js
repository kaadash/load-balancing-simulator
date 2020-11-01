import React, { useState } from 'react';
import { ResponsiveBar } from '@nivo/bar'
import {
  Form,
  Select,
  InputNumber,
  Switch,
  Radio,
  Slider,
  Table
} from 'antd';

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const data = [
  {
    "country": "AD",
    "hot dog": 50,
    "burger": 41,
    "sandwich": 133,
    "kebab": 45,
    "fries": 110,
    "donut": 153,
  },
]


const columns = [
  {
    title: 'Full Name',
    width: 100,
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
  },
  {
    title: 'Age',
    width: 100,
    dataIndex: 'age',
    key: 'age',
    fixed: 'left',
  },
  { title: 'Column 1', dataIndex: 'address', key: '1' },
  { title: 'Column 2', dataIndex: 'address', key: '2' },
  { title: 'Column 3', dataIndex: 'address', key: '3' },
  { title: 'Column 4', dataIndex: 'address', key: '4' },
  { title: 'Column 5', dataIndex: 'address', key: '5' },
  { title: 'Column 6', dataIndex: 'address', key: '6' },
  { title: 'Column 7', dataIndex: 'address', key: '7' },
  { title: 'Column 8', dataIndex: 'address', key: '8' },
  {
    title: 'Action',
    key: 'operation',
    fixed: 'right',
    width: 100,
    render: () => <a>action</a>,
  },
];

const dataTable = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 40,
    address: 'London Park',
  },
];

export const CurrentLoadTab = () => {
  return (
    <div>
      <Radio.Group>
        <Radio.Button value="table">table</Radio.Button>
        <Radio.Button value="graph">graph</Radio.Button>
      </Radio.Group>

      <div>
        <Table columns={columns} dataSource={dataTable} scroll={{ x: 1300 }} />
      </div>
      <div style={{ height: '300px', width: '600px', }}>
        <ResponsiveBar
          data={data}
          groupMode="grouped"
          keys={['hot dog', 'burger', 'sandwich', 'kebab', 'fries', 'donut']}
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