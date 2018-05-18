import React from 'react';
import { Column, Table } from 'react-virtualized';
import { Link } from 'react-router-dom';
import 'react-virtualized/styles.css';

let tableData = [
  {
    id: 1,
    name: "Bob",
    status: "Just fine!",
    action: "TODO"
  },
  {
    id: 2,
    name: "Sue",
    status: "Terrific!",
    action: "TODO"
  },
  {
    id: 3,
    name: "Jeff",
    status: "Could be better!",
    action: "TODO"
  }
];

class Registry extends React.Component {
  actionCellRenderer({ rowData }) {
    const routeLink = "/registry-view/" + rowData.id;
    return (
      <Link to={routeLink}>View</Link>
    );
  }

  render() {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">The Physician Registry</h2>
        </div>
        <div className="card-content">
          <Table
            width={1000}
            height={300}
            headerHeight={20}
            rowHeight={30}
            rowCount={tableData.length}
            rowGetter={({ index }) => tableData[index]}
          >
            <Column
              dataKey="name"
              label="Physician Name"
              width={4000}
              className="ReactVirtualized__Table__headerRow"
            />
            <Column
              dataKey="status"
              label="Status"
              width={3000}
            />
            <Column
              dataKey="action"
              label="Action"
              width={4000}
              cellRenderer={this.actionCellRenderer}
            />
          </Table>
        </div>
      </div>
    );
  }
}

export default Registry;
