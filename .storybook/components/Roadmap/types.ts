export type Row = {
  component: string;
  href?: string;
  status: '✅ Done' | '🚧 Planned' | '🛠️ In Progress';
  stage?: '🔵 experimental' | '🟢 stable' | '🟠 draft' | '🔴 deprecated';
  planned: string;
};

export type Column = { name: string; key: Exclude<keyof Row, 'href'> };

export type Columns = Column[];
export type Rows = Row[];
