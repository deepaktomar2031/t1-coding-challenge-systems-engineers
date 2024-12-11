"use client";

import { useStream } from "@/hooks/useStream";

interface PnL {
  startTime: string;
  endTime: string;
  pnl: number;
}

interface TableProps {
  pnls: Array<PnL>;
}
const Table = ({ pnls }: TableProps) => (
  <table className="table-auto" border-collapse>
    <thead>
      <tr>
        <th>Start</th>
        <th>End</th>
        <th>PnL</th>
      </tr>
    </thead>
    <tbody>
      {pnls.map((pnl) => (
        <tr key={pnl.startTime}>
          <td className="px-6">{pnl.startTime}</td>
          <td className="px-6">{pnl.endTime}</td>
          <td className="px-6">{pnl.pnl}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const PnLs = () => {
  const pnls = useStream<Array<PnL>>("/pnl");

  return pnls ? <Table pnls={pnls} /> : <p>loading pnl...</p>;
};

export default PnLs;
