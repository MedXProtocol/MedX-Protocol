import React from 'react'
import {Column, Table, AutoSizer} from 'react-virtualized';
import {Link} from 'react-router-dom';
import 'react-virtualized/styles.css';
import {updateStatus, getAllListings} from '../../utils/web3-util';
import spinner from '../../img/spinner.gif';
import ErrorModal from "../modals/ErrorModal";
import SuccessModal from "../modals/SuccessModal";
import GenericLoadingModal from "../modals/GenericLoadingModal";

function actionCellRenderer({
                                cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex
                            }) {
    let routeLink = "/challenge-view/" + rowData.listingHash;

    const newTo = {
        pathname: "/challenge-view/" + rowData.listingHash,
        state: {message: rowData.listingHash}
    };
    return (
        <Link to={newTo} className="btn btn-fill btn-block btn-primary btn-sm">View</Link>
    );
}

function locationCellRenderer({
                                  cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex
                              }) {
    return (
        <div>{rowData.application.medLicenseLocation}</div>
    );
}

function nameCellRenderer({
                              cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex
                          }) {
    return (
        <div>Dr. {rowData.application.firstName} {rowData.application.lastName}</div>
    );
}

export class RegistryApplication extends React.Component {
    constructor(props) {
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

    componentDidMount() {
        this.getListings();
        this.props.parentCallback("The Physician Registry");
    }

    getListings = async (event) => {
        this.setState({noneDisplayString: 'none'});
        this.setState({spinnerDisplayString: 'block'});
        this.setState({tableDisplayString: 'none'});
        getAllListings(function (result) {

            //filter out only the listings that are currently not challenged
            let filteredResult = result.filter(listing => listing.challengeID <= 0 || listing.challenge.resolved).sort(item => item.whitelisted);

            //An alternative filter
            //Pass condition: (100 * poll.votesFor) > (poll.voteQuorum * (poll.votesFor + poll.votesAgainst));
            //let filteredResult = result.filter(listing => listing.challengeID <= 0 || listing.challenge.resolved || (listing.poll.pollEnded && (100 * parseInt(listing.poll.votesFor) > parseInt(listing.poll.voteQuorum) * ( parseInt(listing.poll.votesFor) + parseInt(listing.poll.votesAgainst) ))));

            if (filteredResult.length == 0) {
                this.setState({noneDisplayString: 'block'});
                this.setState({spinnerDisplayString: 'none'});
                this.setState({tableDisplayString: 'none'});
            }
            else {
                this.setState({noneDisplayString: 'none'});
                this.setState({spinnerDisplayString: 'none'});
                this.setState({tableDisplayString: 'block'});
            }
            this.setState({allListings: filteredResult});
            this.setState({listings: filteredResult});
        }.bind(this));
    }

    handleCountryFilter = (e) => {
        e.preventDefault();
        let filterText = document.getElementById('countryFilter').value.toLowerCase();
        let filteredResult = this.state.allListings.filter(listing => listing.application.medLicenseLocation.toLowerCase().includes(filterText) && (listing.challengeID <= 0 || listing.challenge.resolved));
        this.setState({listings: filteredResult});
    }

    handleUpdateClick = (listingHash) => {
        this.setState({showErrorModal: false});
        this.setState({showLoadingModal: true});
        updateStatus(listingHash, function (error, result) {
            if (error) {
                console.log(error);
                this.setState({showErrorModal: true});
                this.setState({showLoadingModal: false});
            }
            else {
                this.setState({showErrorModal: false});
                this.setState({showLoadingModal: false});
                this.setState({showWhitelistedModal: true});
            }
        }.bind(this));
    }

    handleErrorOKClickModal = (e) => {
        e.preventDefault();
        this.setState({showErrorModal: false});
    }

    handleWhitelistedClickModal = (e) => {
        e.preventDefault();
        this.setState({showWhitelistedModal: false});
        this.getListings();
    }

    _rowClassName = ({index}) => {
        if (index < 0) {
            return "";
        } else {
            return index % 2 === 0 ? {backgroundColor: '#f3f3f4', marginTop: 4} : {backgroundColor: '#fff', marginTop: 4};
        }
    };

    render() {
        return (
            <div className="card">

                <div className="text-center" style={{display: this.state.spinnerDisplayString}}><br/><img style={{maxWidth: '100px'}} src={spinner}/><br/>Loading...</div>
                <div className="text-center" style={{display: this.state.noneDisplayString}}><br/>There are no entries in the registry.<br/></div>


                <div className="card-content table-responsive table-full-width">
                    <div style={{display: this.state.tableDisplayString}}>
                        <div className="input-group-sm mb-3 text-right" style={{marginRight: 10}}>
                            Filter by Country:&nbsp;
                            <input className="form-control input-sm" style={{maxWidth: '280px', display: 'inline'}} type="text" onChange={this.handleCountryFilter} id="countryFilter"/>
                        </div>

                        <br/>

                        <AutoSizer disableHeight>
                            {({width}) => (
                                <Table
                                    width={width}
                                    height={580}
                                    headerHeight={30}
                                    rowHeight={40}
                                    rowCount={this.state.listings.length}
                                    rowGetter={({index}) => this.state.listings[index]}
                                    className="table"
                                    headerStyle={{borderBottomWidth: 1, borderBottomColor: '#dedede', borderBottomStyle: 'solid'}}
                                    rowStyle={this._rowClassName}
                                >
                                    <Column
                                        dataKey="owner"
                                        label="Physician Name"
                                        width={1250}
                                        cellRenderer={nameCellRenderer}
                                    />
                                    <Column
                                        dataKey="licenseLocation"
                                        label="Country"
                                        width={1250}
                                        cellRenderer={locationCellRenderer}
                                    />
                                    <Column
                                        dataKey="applicationExpiry"
                                        label="Status"
                                        width={1250}
                                        cellRenderer={({
                                                           cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex
                                                       }) => {
                                            let status = "unknown";
                                            if (rowData.whitelisted)
                                                status = "Active";
                                            else
                                                status = "New Application";

                                            //A check to see if this application needs to be whitelisted by calling updateStatus
                                            if (!rowData.whitelisted && rowData.timeCalled >= rowData.applicationExpiry) {
                                                return (
                                                    <div>{status}&nbsp; <a className="text-warning" style={{cursor: 'pointer'}}
                                                                           onClick={() => this.handleUpdateClick(rowData.listingHash)}><span className="ti-reload"/></a></div>
                                                );
                                            }

                                            return (
                                                <div>{status}</div>
                                            );

                                        }
                                        }
                                    />
                                    <Column
                                        dataKey="action"
                                        label="Action"
                                        width={500}
                                        className={"text-center"}
                                        headerClassName={"text-center"}
                                        cellRenderer={actionCellRenderer}
                                    />
                                </Table>
                            )}
                        </AutoSizer>
                    </div>
                </div>

                <GenericLoadingModal showModal={this.state.showLoadingModal} contentText={"Waiting for transaction to be mined..."}/>
                <ErrorModal showModal={this.state.showErrorModal} closeHandler={this.handleErrorOKClickModal}/>
                <SuccessModal showModal={this.state.showWhitelistedModal} header={"Status Updated"} content={"The status of this application has been updated."} closeHandler={this.handleWhitelistedClickModal}/>
            </div>
        );
    }
}
