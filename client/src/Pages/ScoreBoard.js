import React from 'react';
import { Table } from 'react-bootstrap';
import { addNotification } from '../handler/AlertHandler';

class Ranking extends React.Component {
      constructor(props) {
            super(props);
            this.state = {
              return_data: {
                table1: [],
                table2: []
              }
            };
      }
      componentDidMount() {
            try {
            fetch(`/api/ranking`)
              .then(response => response.json())
              .then(return_data => {
                this.setState({
                  return_data: {
                    table1: return_data.table1.rows,
                    table2: return_data.table2.rows
                  }
                });
              });
            }  catch (err) {
              console.error(err.message);
            }
      }


      render() {
            const { return_data } = this.state;
            return (
              <div className='ranking-container'>
                <h1>User Ranking </h1>
                <br></br>
                <h5>Top 10 Lenders and Borrowers </h5>
                <br></br>
                <h3>Lenders</h3>
                <Table striped bordered hover >
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Favours given</th>
                    </tr>
                  </thead>
                  {return_data.table1.map((item, index) => (
                    <tbody key={index}>
                      <tr>
                        <td>{item.user}</td>
                        <td>{item.total_favors_given}</td>
                      </tr>
                    </tbody>
                  ))}
                  </Table>
                  <br></br>
                  <h3>Borrowers</h3>
                  <Table striped bordered hover >
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Favours received</th>
                    </tr>
                  </thead>
                  {return_data.table2.map((item, index) => (
                    <tbody key={index}>
                      <tr>
                        <td>{item.user}</td>
                        <td>{item.total_favors_received}</td>
                      </tr>
                    </tbody>
                  ))}
                </Table>
              </div>
            );
      }
}
export default Ranking;