import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Modal from "./Modal";

export default {
  title: "Modal",
  component: Modal,
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = (args) => <Modal {...args} />;

export const Default = Template.bind({});

Default.args = {
  isOpen: true,
  onClose: () => {
    // console.log("closing");
  },
  children: <div>modal content</div>,
  containerId: undefined,
};