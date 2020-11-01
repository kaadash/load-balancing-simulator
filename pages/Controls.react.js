import React from 'react';
import {
  Form,
  Select,
  InputNumber,
  Switch,
  Radio,
  Slider,
} from 'antd';
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const normFile = (e) => {
  console.log('Upload event:', e);

  if (Array.isArray(e)) {
    return e;
  }

  return e && e.fileList;
};

export default () => {
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  return (
    <Form
      name="validate_other"
      {...formItemLayout}
      onFinish={onFinish}
      initialValues={{
        ['input-number']: 3,
        ['checkbox-group']: ['A', 'B'],
        rate: 3.5,
      }}
    >
      <Form.Item name="radio-group" label="Radio.Group">
        <Radio.Group>
          <Radio.Button value="diffusion_1">Diffusion 1</Radio.Button>
          <Radio.Button value="diffusion_2">Diffusion 2</Radio.Button>
          <Radio.Button value="nna_async">NNA Async</Radio.Button>
          <Radio.Button value="nna_sync">NNA Sync</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="Size:">
        <span className="ant-form-text">X/Y/Z</span>
      </Form.Item>
      <Form.Item label="Size X:">
        <Form.Item name="size-x" noStyle>
          <InputNumber min={1} max={10} />
        </Form.Item>
      </Form.Item>
      <Form.Item label="Size Y:">
        <Form.Item name="size-y" noStyle>
          <InputNumber min={1} max={10} />
        </Form.Item>
      </Form.Item>
      <Form.Item label="Size Z:">
        <Form.Item name="size-z" noStyle>
          <InputNumber min={1} max={10} />
        </Form.Item>
      </Form.Item>

      <Form.Item name="diffusion" label="diffusion">
        <Slider
          marks={{
            0: '0',
            100: '0.99',
          }}
        />
      </Form.Item>
      <Form.Item name="switch" label="Start/Stop" valuePropName="checked">
        <Switch />
      </Form.Item>
    </Form>
  );
};
