import React, { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar'
import {
  Radio,
  Table,
  Modal,
  Button,
  InputNumber,
} from 'antd';

export const CurrentLoadTab = (props) => {
  const [chartKeys, setChartKeys] = useState([]);
  const [chartValues, setChartValues] = useState([]);
  const [editOpened, setEditOpened] = useState(false);
  const [processorToEdit, setProcessorToEdit] = useState(null);
  
  const [tableHeader, setTableHeader] = useState([
    { title: 'Processor ID', dataIndex: 'id', key: '1' },
    { title: 'Current load', dataIndex: 'currentLoad', key: '2' },
    {
      title: 'Action',
      key: 'key',
      fixed: 'right',
      width: 200,
      render: (_, record) => <div onClick={() => openEditPopup(record)}>Change current load</div>,
    },
  ]);
  const openEditPopup = (processor) => {
    setProcessorToEdit({...processor});
    setEditOpened(true);
  }
  const handleCancel = () => {
    setEditOpened(false);
  }
  const handleOk = () => {
    setEditOpened(false);
    props.onChangeProcessor(processorToEdit);
    setProcessorToEdit(null);

  }
  const onChangeProcessorTasks = (value) => {
    setProcessorToEdit({
      ...processorToEdit,
      currentLoad: value
    })
  }
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    setChartKeys((props.processors || []).map(processor => processor.id));
    setChartValues([(props.processors || []).reduce((acc, processor) => {
      acc[processor.id] = Math.floor(processor.currentLoad);
      return acc;
    }, {})]);
    setTableData((props.processors || []).map((processor) => {
      return {
        id: processor.id,
        currentLoad: Math.floor(processor.currentLoad),
      }
    }));
  }, [props.processors]);
  return (
    <div>
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
          animate={false}
          motionStiffness={90}
          motionDamping={15}
        />
      </div>
      <Modal
        visible={editOpened}
        title="Edit process number of task"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
            </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Submit
            </Button>,
        ]}
      >
        <InputNumber onChange={onChangeProcessorTasks} value={processorToEdit ? processorToEdit.currentLoad : 0 }/>
      </Modal>
    </div>
  )
}

export default CurrentLoadTab;