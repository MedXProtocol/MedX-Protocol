import React from 'react';
import { Column, Table, AutoSizer } from 'react-virtualized';
import { Link } from 'react-router-dom';
import 'react-virtualized/styles.css';
import { updateStatus, getAllListings } from '../../utils/web3-util';
import spinner from '../../img/spinner.gif';
import ErrorModal from '../../components/modals/ErrorModal';
import GenericOkModal from '../../components/modals/GenericOkModal';
import GenericLoadingModal from '../../components/modals/GenericLoadingModal';
import {msToTime} from "../../utils/common-util";

class RegistryApplication extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      listings: [],
      allListings: [],
      noneDisplayString: 'none',
      spinnerDisplayString: 'block',
      tableDisplayString: 'none',
      showErrorModal: false,
      showLoadingModal: false
    };
    this._rowClassName = this._rowClassName.bind(this);
  }

  componentDidMount () {
    this.getListings();
    this.props.parentCallback('DocBase Registry');
  }

  getListings = async (event) => {
    this.setState({
      noneDisplayString: 'none',
      spinnerDisplayString: 'block',
      tableDisplayString: 'none',
    });
    getAllListings((result) => {

      //filter out only the listings that are currently not challenged
      const filteredResult = result.filter(listing => listing.challengeID <= 0 || listing.challenge.resolved).sort(item => item.whitelisted);

      //An alternative filter
      //Pass condition: (100 * poll.votesFor) > (poll.voteQuorum * (poll.votesFor + poll.votesAgainst));
      //let filteredResult = result.filter(listing => listing.challengeID <= 0 || listing.challenge.resolved || (listing.poll.pollEnded && (100 * parseInt(listing.poll.votesFor) > parseInt(listing.poll.voteQuorum) * ( parseInt(listing.poll.votesFor) + parseInt(listing.poll.votesAgainst) ))));

      this.setState({
        noneDisplayString: filteredResult.length ? 'none' : 'block',
        spinnerDisplayString: 'none',
        tableDisplayString: filteredResult.length ? 'block' : 'none',
        allListings: filteredResult,
        listings: filteredResult,
      });
    });
  };

  handleCountryFilter = (e) => {
    e.preventDefault();
    let filterText = document.getElementById('countryFilter').value.toLowerCase();
    let filteredResult = this.state.allListings.filter(listing => listing.application.medLicenseLocation.toLowerCase().includes(filterText) && (listing.challengeID <= 0 || listing.challenge.resolved));
    this.setState({ listings: filteredResult });
  };

  handleUpdateClick = (listingHash) => {
    this.setState({
      showErrorModal: false,
      showLoadingModal: true,
    });
    updateStatus(listingHash, (error, result) => {
      if (error) {
        console.log(error);
        this.setState({
          showErrorModal: true,
          showLoadingModal: false,
        });
        return;
      }

      this.setState({
        showErrorModal: false,
        showLoadingModal: false,
        showWhitelistedModal: true,
      });
    });
  };

  handleWhitelistedClickModal = (e) => {
    this.setState({ showWhitelistedModal: false });
    this.getListings();
  };

  _rowClassName = ({ index }) => {
    if (index < 0) {
      return '';
    } else {
      return index % 2 === 0 ? { backgroundColor: '#f3f3f4', marginTop: 4 } : { backgroundColor: '#fff', marginTop: 4 };
    }
  };

  actionCellRenderer ({ rowData }) {
    const newTo = {
      pathname: '/challenge-view/' + rowData.listingHash,
      state: { message: rowData.listingHash }
    };
    return (
      <Link to={newTo} className="btn btn-fill btn-block btn-primary btn-sm">View</Link>
    );
  }

  locationCellRenderer ({ rowData }) {
    return (
      <div>{rowData.application.medLicenseLocation}</div>
    );
  }

  verifiedRenderer ({ rowData }) {
    let verified = localStorage.getItem('verify' + rowData.listingHash);
    return (
      <div>{verified === 'true' ?
        <b><i className="ti-check text-success" style={{ fontSize: 'x-large' }}/></b> : null}</div>
    );
  }

  nameCellRenderer ({ rowData }) {
    return (
      <div>{rowData.application.physicianName}</div>
    );
  }

  render () {
    return (
      <div className="card">

        <div className="text-center" style={{ display: this.state.spinnerDisplayString }}><br/><img role="presentation"
          style={{ maxWidth: '100px' }} src={spinner}/><br/>Loading...
        </div>
        <div className="text-center" style={{ display: this.state.noneDisplayString }}><br/><h5>There are no entries in the
            registry.</h5><br/></div>


        <div className="card-content table-responsive table-full-width">
          <div style={{ display: this.state.tableDisplayString }}>
            <div className="input-group-sm mb-3 text-right" style={{ marginRight: 10 }}>
              Filter by Country:&nbsp;
              <input className="form-control input-sm" style={{ maxWidth: '280px', display: 'inline' }} type="text"
                     onChange={this.handleCountryFilter} id="countryFilter"/>
            </div>

            <br/>

            <AutoSizer disableHeight>
              {({ width }) => (
                <Table
                  width={width}
                  height={580}
                  headerHeight={30}
                  rowHeight={40}
                  rowCount={this.state.listings.length}
                  rowGetter={({ index }) => this.state.listings[index]}
                  className="table"
                  headerStyle={{ borderBottomWidth: 1, borderBottomColor: '#dedede', borderBottomStyle: 'solid' }}
                  rowStyle={this._rowClassName}
                >
                  <Column
                    dataKey="owner"
                    label="Physician Name"
                    width={1250}
                    cellRenderer={this.nameCellRenderer}
                  />
                  <Column
                    dataKey="licenseLocation"
                    label="Country"
                    width={1250}
                    cellRenderer={this.locationCellRenderer}
                  />
                  <Column
                    dataKey="applicationExpiry"
                    label="Status"
                    width={1000}
                    cellRenderer={
                      ({ rowData }) => {
                        let status = 'unknown';
                        if (rowData.whitelisted) {
                          status = 'Active';
                        } else {
                          status = 'New Application';
                        }
                        //A check to see if this application needs to be whitelisted by calling updateStatus
                        if (!rowData.whitelisted && rowData.timeCalled >= rowData.applicationExpiry) {
                          return (
                            <div>{status}&nbsp; <a className="text-warning" style={{ cursor: 'pointer' }}
                                                   onClick={() => this.handleUpdateClick(rowData.listingHash)}><span
                              className="ti-reload"/></a></div>
                          );
                        }
                        return (
                          <div>{status}</div>
                        );

                      }
                    }
                  />
                  <Column
                    dataKey="timeRemaining"
                    label="Time Remaining"
                    width={500}
                    className={'text-center'}
                    headerClassName={'text-center'}
                    cellRenderer={
                        ({ rowData }) => {
                          if (rowData.timeCalled <= rowData.applicationExpiry) {
                                return <div>{msToTime(rowData.applicationExpiry * 1000 - rowData.timeCalled * 1000)}</div>;
                          } else {
                              return <div>-</div>
                          }
                        }
                    }
                  />
                  <Column
                    dataKey="verified"
                    label="Verified"
                    width={500}
                    className={'text-center'}
                    headerClassName={'text-center'}
                    cellRenderer={this.verifiedRenderer}
                  />
                  <Column
                    dataKey="action"
                    label="Action"
                    width={500}
                    className={'text-center'}
                    headerClassName={'text-center'}
                    cellRenderer={this.actionCellRenderer}
                  />
                </Table>
              )}
            </AutoSizer>
          </div>
        </div>

        <GenericLoadingModal showModal={this.state.showLoadingModal}/>
        <ErrorModal showModal={this.state.showErrorModal}/>
        <GenericOkModal showModal={this.state.showWhitelistedModal} headerText={'Status Updated'}
                        contentText={'The status of this application has been updated.'}
                        closeHandler={this.handleWhitelistedClickModal}/>
      </div>
    );
  }
}

export default RegistryApplication;