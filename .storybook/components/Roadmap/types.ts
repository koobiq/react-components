export type Row = {
  component: string;
  status: '✅ Done' | '🚧 Planned';
  stage?: '🔵 experimental ' | '🟢 stable' | '🟠 draft' | '🔴 deprecated';
  planned: string;
};

export type Column = { name: string; key: keyof Row };

export type Columns = Column[];
export type Rows = Row[];
