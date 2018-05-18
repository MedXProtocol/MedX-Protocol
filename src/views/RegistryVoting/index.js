import React from 'react'
import {Column, Table, AutoSizer} from 'react-virtualized';
import {Link} from 'react-router-dom';
import 'react-virtualized/styles.css';
import {updateStatus, getAllListings} from '../../utils/web3-util';
import {msToTime} from '../../utils/common-util';
import spinner from '../../img/spinner.gif';
import GenericLoadingModal from "../../components/modals/GenericLoadingModal";
import ErrorModal from "../../components/modals/ErrorModal";
import GenericOkModal from "../../components/modals/GenericOkModal";

function actionCellRenderer({cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex}) {
    const newTo = {
        pathname: "/voting-view/" + rowData.listingHash,
        state: {message: rowData.listingHash}
    };

    if (rowData.poll.numTokens <= 0 && rowData.poll.commitPeriodActive) {
        return (
            <Link to={newTo} className={"btn btn-sm btn-primary btn-fill btn-block"}>Vote</Link>
        );
    }
    else {
        return (
            <a disabled className={"btn btn-sm btn-primary btn-fill btn-block"}>Vote</a>
        );
    }
}


function locationCellRenderer({cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex}) {
    return (
        <div>{rowData.application.medLicenseLocation}</div>
    );
}

function nameCellRenderer({cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex}) {
    return (
        <div>{rowData.application.physicianName}</div>
    );
}

class RegistryVoting extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            listings: [],
            allListings: [],
            noneDisplayString: 'none',
            spinnerDisplayString: 'block',
            tableDisplayString: 'none'
        };

        this._rowClassName = this._rowClassName.bind(this);
    }

    componentDidMount() {
        this.getListings();
        this.props.parentCallback("Challenged Applications");
    }

    getListings = async (event) => {

        this.setState({noneDisplayString: 'none'});
        this.setState({spinnerDisplayString: 'block'});
        this.setState({tableDisplayString: 'none'});

        getAllListings(function (result) {

            //filter out only the listings that are currently challenged
            let filteredResult = result.filter(listing => listing.challengeID !== undefined && listing.challengeID > 0 && !listing.challenge.resolved);

            if (filteredResult.length === 0) {
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
        let filteredResult = this.state.allListings.filter(listing => listing.application.medLicenseLocation.toLowerCase().includes(filterText) && (listing.challengeID !== undefined && listing.challengeID > 0 && !listing.challenge.resolved));
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
                <div className="text-center" style={{display: this.state.spinnerDisplayString}}><br/><img role="presentation" style={{maxWidth: '100px'}} src={spinner}/><br/>Loading...</div>
                <div className="text-center" style={{display: this.state.noneDisplayString}}><br/><h5>There are no challenged applications.</h5><br/></div>

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
                                        dataKey="name"
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
                                        dataKey="commitPeriodActive"
                                        label="Status"
                                        width={1250}
                                        cellRenderer={({
                                                           cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex
                                                       }) => {
                                            let statusString = "";
                                            if (rowData.poll.commitPeriodActive)
                                                statusString = "Voting";
                                            if (rowData.poll.revealPeriodActive)
                                                statusString = "Revealing";
                                            if (rowData.poll.pollEnded)
                                                statusString = "Poll Ended";
                                                
                                            //A check to see if this application needs to be whitelisted by calling updateStatus
                                            if ((rowData.poll.pollEnded && !rowData.challenge.resolved)) {
                                                return (
                                                    <div>{statusString} <a className="text-warning" style={{cursor: 'pointer'}}
                                                                           onClick={() => this.handleUpdateClick(rowData.listingHash)}><span className="ti-reload"/></a></div>
                                                );
                                            }

                                            return (
                                                <div>{statusString}</div>
                                            );

                                        }
                                        }
                                    />
                                    <Column
                                        dataKey="commitPeriodActive"
                                        label="Time Remaining"
                                        width={1250}
                                        cellRenderer={({
                                                           cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex
                                                       }) => {
                                            let timeString = "N/A";
                                            if (rowData.poll.commitPeriodActive)
                                                timeString = msToTime(rowData.poll.commitEndDate * 1000 - rowData.timeCalled * 1000);
                                            if (rowData.poll.revealPeriodActive)
                                                timeString = msToTime(rowData.poll.revealEndDate * 1000 - rowData.timeCalled * 1000);
                                            if (rowData.poll.pollEnded)
                                                timeString = "N/A";

                                            return (
                                                <div>{timeString}</div>
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

                <GenericOkModal showModal={this.state.showWhitelistedModal} headerText={"Status Updated"} contentText={"The status of this application has been updated."} closeHandler={this.handleWhitelistedClickModal}/>
                <ErrorModal showModal={this.state.showErrorModal} />
                <GenericLoadingModal showModal={this.state.showLoadingModal} />
            </div>
        );
    }
}

export default RegistryVoting;
