import React from "react";
import { Form, InputNumber, Button, Radio, Slider, Affix } from "antd";
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
    props.onStart(selected, formData.getFieldsValue());
  };

  const onChange = (event, value) => {
    props.onChangeValues(value);
  };

  const shouldShowDiff = formData.getFieldValue('algorithm') === 'diffusion_sync' || formData.getFieldValue('algorithm') === 'diffusion_async';

  return (
    <div>
      <Form
        form={formData}
        onFieldsChange={onChange}
        name="validate_other"
        {...formItemLayout}
        initialValues={{
          ["size-x"]: 5,
          ["size-y"]: 1,
          ["size-z"]: 1,
          ["speed"]: 100,
          ["algorithm"]: "diffusion_sync",
          ["diffusion"]: 80,
        }}
      >
        <Form.Item name="algorithm" label="Algorithm:">
          <Radio.Group disabled={props.started}>
            <Radio.Button value="diffusion_sync">Diffusion Sync</Radio.Button>
            <Radio.Button value="diffusion_async">Diffusion Async</Radio.Button>
            <Radio.Button value="nna_async">NNA Async</Radio.Button>
            <Radio.Button value="nna_sync">NNA Sync</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Size X:">
          <Form.Item name="size-x" noStyle>
            <InputNumber disabled={props.started} min={1} />
          </Form.Item>
        </Form.Item>
        <Form.Item label="Size Y:">
          <Form.Item name="size-y" noStyle>
            <InputNumber disabled={props.started} min={1} />
          </Form.Item>
        </Form.Item>
        <Form.Item label="Size Z:">
          <Form.Item name="size-z" noStyle>
            <InputNumber disabled={props.started} min={1} />
          </Form.Item>
        </Form.Item>
        <div style={{display: shouldShowDiff ? 'block' : 'none'}}>
          <Form.Item name="diffusion" label="diffusion">
            <Slider
              disabled={props.started}
              marks={{
                0: "0",
                100: "0.99",
              }}
            />
          </Form.Item>
        </div>
        <Form.Item name="speed" label="speed">
          <Slider
            disabled={props.started}
            marks={{
              1: "1",
              100: "100",
            }}
          />
        </Form.Item>
      </Form>
      <Affix offsetTop={10}>
        <Button
          type="primary"
          danger={props.started}
          block
          onClick={() => onStart(!props.started)}
        >
          {props.started
            ? "SIMULATION IS RUNNING... CLICK TO STOP SIMULATION"
            : "START SIMULATION"}
        </Button>
      </Affix>
    </div>
  );
};
