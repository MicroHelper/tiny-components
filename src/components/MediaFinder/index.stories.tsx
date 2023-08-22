import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { nanoid } from "nanoid";
import MediaFinder from "./index";
import type { Media } from "./media";

export default {
  title: "Media Finder",
  component: MediaFinder,
} as ComponentMeta<typeof MediaFinder>;

const Template: ComponentStory<typeof Wrapper> = (args) => (
  <Wrapper {...args} />
);

const item = {
  _id: "",
  type: "image",
  fileName: "city.jpeg",
  dir: "static/media/stories/images",
};

const createItems = (length: number) => {
  return Array(length)
    .fill(0)
    .map(() => ({ ...item, _id: nanoid() }));
};

interface Props {
  initialItems: Array<Media>;
}

const Wrapper = ({ initialItems }: Props) => {
  const [items, setItems] = useState(initialItems);
  const [isOpen, setOpen] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Array<Media["_id"]>>([]);

  return isOpen ? (
    <MediaFinder
      items={items}
      getImageUrl={(fileName) => `static/media/stories/images/${fileName}`}
      onSelect={(ids) => {
        setSelectedIds(ids.map((id) => `${id}`));
      }}
      onUpload={(files) => {
        if (files) setItems([...items, ...createItems(files.length)]);
      }}
      onDelete={(ids) => {
        setItems(items.filter((item) => !ids.includes(item._id)));
      }}
      onClose={() => setOpen(false)}
    />
  ) : (
    <div>
      finder closed <button onClick={() => setOpen(true)}>reopen</button>
    </div>
  );
};

export const Default: ComponentStory<typeof Wrapper> = () => (
  <Wrapper initialItems={[]} />
);

export const OneItem: ComponentStory<typeof Wrapper> = () => (
  <Wrapper initialItems={createItems(1)} />
);

export const TwoItems: ComponentStory<typeof Wrapper> = () => (
  <Wrapper initialItems={createItems(2)} />
);

export const ThreeItems: ComponentStory<typeof Wrapper> = () => (
  <Wrapper initialItems={createItems(3)} />
);

export const SevenItems: ComponentStory<typeof Wrapper> = () => (
  <Wrapper initialItems={createItems(7)} />
);
