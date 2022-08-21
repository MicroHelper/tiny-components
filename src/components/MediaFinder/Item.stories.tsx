import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Item from "./Item";
import img from "../../../stories/images/city.jpeg";

export default {
  title: "MediaFinder Item",
  component: Item,
} as ComponentMeta<typeof Item>;

const Template: ComponentStory<typeof Item> = (args) => <Item {...args} />;

export const Default = Template.bind({});

Default.args = {
  imageUrl: img,
  isSelected: false,
  onChange: (args) => console.log(args),
};

export const Selected = Template.bind({});

Selected.args = {
  ...Default.args,
  isSelected: true,
};
