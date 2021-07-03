import React, { useEffect, useState } from "react";
import { BarCanvas } from "@nivo/bar";
import { Radio, Table, Modal, Button, InputNumber } from "antd";

export const CurrentLoadTab = (props) => {
  const [chartKeys, setChartKeys] = useState([]);
  const [chartValues, setChartValues] = useState([]);
  const [editOpened, setEditOpened] = useState(false);
  const [processorToEdit, setProcessorToEdit] = useState(null);

  const tableHeader = [
    { title: "Processor ID", dataIndex: "id", key: "1" },
    { title: "Current load", dataIndex: "currentLoad", key: "2" },
    {
      title: "Action",
      key: "key",
      fixed: "right",
      width: 200,
      render: (_, record) => (
        <div onClick={() => openEditPopup(record)}>Change current load</div>
      ),
    },
  ];
  const openEditPopup = (processor) => {
    setProcessorToEdit({ ...processor });
    setEditOpened(true);
  };
  const handleCancel = () => {
    setEditOpened(false);
  };
  const handleOk = () => {
    setEditOpened(false);
    props.onChangeProcessor(processorToEdit);
    setProcessorToEdit(null);
  };
  const onChangeProcessorTasks = (value) => {
    setProcessorToEdit({
      ...processorToEdit,
      currentLoad: value,
    });
  };
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    setChartValues(
      (props.processors || [])
        .map((processor) => {
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
  console.log(chartValues);
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
        <InputNumber
          onChange={onChangeProcessorTasks}
          value={processorToEdit ? processorToEdit.currentLoad : 0}
        />
      </Modal>
    </div>
  );
};

export default CurrentLoadTab;
