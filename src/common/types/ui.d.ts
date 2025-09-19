export type RadioItem = {
  value: string;
  func: () => void;
  unfunc?: () => void;
};

export type RadioItems = Set<RadioItem>;
