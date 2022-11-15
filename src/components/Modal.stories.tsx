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

export const WithStyles = Template.bind({});

WithStyles.args = {
  ...Default.args,
  children: (
    <div
      style={{
        padding: "1em",
        height: "10em",
        border: "1px solid lightblue",
        backgroundColor: "white",
      }}
    >
      <h2>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</h2>
      <div>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rem nam
        accusamus aperiam magni aut totam voluptas delectus commodi voluptatum
        voluptatem.
      </div>
    </div>
  ),
};

export const WithoutCloseButton = Template.bind({});

WithoutCloseButton.args = { ...WithStyles.args, onClose: undefined };
