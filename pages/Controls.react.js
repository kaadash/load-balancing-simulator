import React from 'react';
import {
  Form,
  InputNumber,
  Switch,
  Radio,
  Slider,
} from 'antd';
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

export default (props) => {
  const [formData] = Form.useForm();

  const onStart = (selected) => {
    console.log('selected', formData);
    props.onStart(selected, formData.getFieldsValue());
  }

  return (
    <Form
      form={formData}
      name="validate_other"
      {...formItemLayout}
      initialValues={{
        ['size-x']: 3,
        ['size-y']: 3,
        ['size-z']: 3,
        ['algorithm']: 'diffusion_1',
        ['diffusion']: 50,
        ['checkbox-group']: ['A', 'B'],
        rate: 3.5,
      }}
    >
      <Form.Item name="algorithm" label="Algorithm:">
        <Radio.Group disabled={props.started}>
          <Radio.Button value="diffusion_1">Diffusion 1</Radio.Button>
          <Radio.Button value="diffusion_2">Diffusion 2</Radio.Button>
          <Radio.Button value="nna_async">NNA Async</Radio.Button>
          <Radio.Button value="nna_sync">NNA Sync</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="Size X:">
        <Form.Item name="size-x" noStyle>
          <InputNumber disabled={props.started} min={1} max={10} />
        </Form.Item>
      </Form.Item>
      <Form.Item label="Size Y:">
        <Form.Item name="size-y" noStyle>
          <InputNumber disabled={props.started} min={1} max={10} />
        </Form.Item>
      </Form.Item>
      <Form.Item label="Size Z:">
        <Form.Item name="size-z" noStyle>
          <InputNumber disabled={props.started} min={1} max={10} />
        </Form.Item>
      </Form.Item>

      <Form.Item name="diffusion" label="diffusion">
        <Slider
          disabled={props.started}
          marks={{
            0: '0',
            100: '0.99',
          }}
        />
      </Form.Item>
      <Form.Item name="switch" label="Start/Stop" valuePropName="checked">
        <Switch onChange={(selected) => onStart(selected)} />
      </Form.Item>
    </Form>
  );
};
