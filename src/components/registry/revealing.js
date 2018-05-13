import React from 'react'
import { Column, Table, AutoSizer } from 'react-virtualized';
import { Modal } from 'react-bootstrap';
import 'react-virtualized/styles.css';
import { getPoll, claimVoterReward, updateStatus, waitForTxComplete, revealVote, getAllPolls, getAllListings } from '../../utils/web3-util';
import { msToTime } from '../../utils/common-util';
import spinner from '../../img/spinner.gif';
import VoteUpload from './vote-upload'
import GenericLoadingModal from "../modals/GenericLoadingModal";
import ErrorModal from "../modals/ErrorModal";
import GenericOkModal from "../modals/GenericOkModal";

function timeCellRenderer({
                              cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex
                          }) {
    //const currentTimeUTC = new Date() / 1000;

    if (rowData.revealPeriodActive) {
        return (
            <div>{msToTime(rowData.revealEndDate * 1000 - rowData.timeCalled * 1000)}</div>
        );
    }

    if (rowData.commitPeriodActive) {
        return (
            <div>{msToTime(rowData.commitEndDate * 1000 - rowData.timeCalled * 1000)}</div>
        );
    }

    return (
        <div>Ended</div>
    );
}


function statusCellRenderer({
                                cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex
                            }) {

    if (rowData.revealPeriodActive) {
        return (
            <div>Revealing</div>
        );
    }

    if (rowData.commitPeriodActive) {
        return (
            <div>Voting</div>
        );
    }

    if (rowData.pollEnded) {
        return (
            <div>Poll Ended</div>
        );
    }

    return (
        <div>Unknown</div>
    );
}


export default class RegistryRevealing extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            polls: [],
            noneDisplayString: 'none',
            spinnerDisplayString: 'block',
            tableDisplayString: 'none',
            showVoteUploadModal : false
        };

        this._rowClassName = this._rowClassName.bind(this);
    }

    componentDidMount() {
        this.getPolls();
        this.props.parentCallback("My Votes");
    }

    getPolls = async (event) => {

        this.setState({noneDisplayString: 'none'});
        this.setState({spinnerDisplayString: 'block'});
        this.setState({tableDisplayString: 'none'});

        getAllPolls(function (result) {

            //filter out only the polls that this user has voted on
            //(listing.poll.pollEnded && (100 * parseInt(listing.poll.votesFor) > parseInt(listing.poll.voteQuorum) * ( parseInt(listing.poll.votesFor) + parseInt(listing.poll.votesAgainst) ))
            let filteredResult = result.filter(poll => poll.numTokens > 0);

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

            this.setState({polls: filteredResult});
        }.bind(this));
    }

    handleThankYouOKClickModal = (e) => {
        e.preventDefault();
        this.setState({showThankYouModal: false});
        this.getPolls();
    }

    handleErrorOKClickModal = (e) => {
        e.preventDefault();
        this.setState({showErrorModal: false});
    }

    handleThankYouClaimOKClickModal = (e) => {
        e.preventDefault();
        this.setState({showThankYouClaimModal: false});
        this.getPolls();
    }

    handleVoteUploadCallback = async (pollID) => {
      
      //do a quick check to make sure the data actually exists in local storage
      let existingVoteString = localStorage.getItem("vote" + pollID);
      let existingVote = JSON.parse(existingVoteString);
      if (!existingVote || !existingVote.salt || !existingVote.voteChoice){
        //TODO: Show error?
      }

      //then fetch a fresh version of the poll from web3-utils
      let thePoll = await getPoll(pollID);

      let processed = false;

      //See if the poll is in reveal
      if (thePoll.numTokens > 0 && thePoll.revealPeriodActive && !thePoll.hasBeenRevealed) {
        processed = true;
        this.handleRevealClick(thePoll.pollID);
      }

      //if the poll isn't in reveal, check to see if it's ended and ready to be claimed
      if (thePoll.pollEnded && thePoll.voterCanClaimReward && thePoll.hasBeenRevealed) {
        processed = true;
        this.handleClaimRewardClick(thePoll.pollID);
      }

      if (!processed) {
        //TODO: Show error?
      }
    }


    handleRevealClick = async (pollID) => {

        this.setState({showLoadingModal: true});

        let existingVote;
        try {
        let existingVoteString = localStorage.getItem("vote" + pollID);
        console.log(existingVoteString);
        existingVote = JSON.parse(existingVoteString);
        }
        catch (e){
          existingVote = null;
        }

        //for testing
        //console.log("VOTE PRIOR TO ERASING-----");
        console.log(existingVote);
        //existingVote = null;

        /*if (!existingVote || !existingVote.salt || !existingVote.voteChoice) {
          //then we need to prompt the user to upload and use this same function as a callback
          this.setState({showLoadingModal: false});
          this.setState({showVoteUploadModal: true});
          this.setState({voteUploadCallbackFunction: this.handleRevealClick});
          console.log("returning");
          return;
        }*/


        console.log("reveal pollID: " + pollID);
        console.log("reveal voteChoice: " + existingVote.voteChoice);
        console.log("reveal salt: " + existingVote.salt);

        revealVote(pollID, existingVote.voteChoice, existingVote.salt, function (error, result) {
            console.log("error: " + error);
            console.log("result: " + result);

            this.setState({showLoadingModal: false});
            if (!error)
                this.setState({showThankYouModal: true});
            else
                this.setState({showErrorModal: true});
        }.bind(this));
    };

    sendClaimVoterRewardTransaction = (pollID) => {
        this.setState({showErrorModal: false});
        this.setState({showClaimLoadingModal: true});
        this.setState({showChallengeLoadingModal: false});
        let persistedPoll = JSON.parse(localStorage.getItem("vote" + pollID));
        claimVoterReward(pollID, persistedPoll.salt, function (error, result) {
            if (error) {
                console.log(error);
                this.setState({showErrorModal: true});
                this.setState({showClaimLoadingModal: false});
                this.setState({showChallengeLoadingModal: false});
            }
            else {
                this.setState({showErrorModal: false});
                this.setState({showClaimLoadingModal: false});
                this.setState({showChallengeLoadingModal: false});
                this.setState({showThankYouClaimModal: true});
            }
        }.bind(this));
    }

    sendUpdateStatusTransaction = (listingHash, pollID) => {
        this.setState({showErrorModal: false});
        this.setState({showClaimLoadingModal: false});
        this.setState({showChallengeLoadingModal: true});
        updateStatus(listingHash, function (error, result) {
            if (error) {
                console.log(error);
                this.setState({showErrorModal: true});
                this.setState({showClaimLoadingModal: false});
                this.setState({showChallengeLoadingModal: false});
            }
            else {
                this.sendClaimVoterRewardTransaction(pollID);
            }
        }.bind(this));
    }


    handleClaimRewardClick = async (pollID) => {

        getAllListings(function (result) {
            //See if there is a challenge that isn't yet resolved for this poll
            let filteredResult = result.filter(listing => listing.challengeID == pollID && !listing.challenge.resolved);
            if (filteredResult.length == 1) {
                //Then we need to call updateStatus(bytes32 _listingHash)
                this.sendUpdateStatusTransaction(filteredResult[0].listingHash, pollID);
            }
            else {
                //else we need to jump right to the claiming claimVoterReward(uint _challengeID, uint _salt)
                this.sendClaimVoterRewardTransaction(pollID);
            }
        }.bind(this));
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

                <div className="text-center" style={{display: this.state.spinnerDisplayString}}><br/><img style={{maxWidth: '100px'}} src={spinner} role="presentation"/><br/>Loading...</div>
                <div className="text-center" style={{display: this.state.noneDisplayString}}><br/><h5>You have no votes to reveal.</h5><br/></div>

                <div className="card-content table-responsive table-full-width">
                    <div style={{display: this.state.tableDisplayString}}>
                        <AutoSizer disableHeight>
                            {({width}) => (
                                <Table
                                    width={width}
                                    height={580}
                                    headerHeight={30}
                                    rowHeight={40}
                                    rowCount={this.state.polls.length}
                                    rowGetter={({index}) => this.state.polls[index]}
                                    className="table"
                                    headerStyle={{borderBottomWidth: 1, borderBottomColor: '#dedede', borderBottomStyle: 'solid'}}
                                    rowStyle={this._rowClassName}
                                >
                                    <Column
                                        dataKey="id"
                                        label="Poll ID"
                                        width={500}
                                        cellRenderer={({rowData}) => {
                                            return rowData.pollID;
                                        }}
                                    />
                                    <Column
                                        dataKey="period"
                                        label="Status"
                                        width={1250}
                                        cellRenderer={statusCellRenderer}
                                    />
                                    <Column
                                        dataKey="time"
                                        label="Time Left"
                                        width={1250}
                                        cellRenderer={timeCellRenderer}
                                    />
                                    <Column
                                        dataKey="reward"
                                        label="Reward Earned"
                                        width={500}
                                        className={"text-center"}
                                        headerClassName={"text-center"}
                                        cellRenderer={({rowData}) => {
                                            return rowData.voterReward === "N/A" ? rowData.voterReward : (rowData.voterReward / 10 ** 18).toFixed(3) + " MEDX";
                                        }}
                                    />
                                    <Column
                                        dataKey="action"
                                        label="Action"
                                        width={500}
                                        className={"text-center"}
                                        headerClassName={"text-center"}
                                        cellRenderer={({
                                                           cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex
                                                       }) => {

                                            if (rowData.revealPeriodActive) {

                                                if (!rowData.hasBeenRevealed) {
                                                    return (
                                                        <button className="btn btn-primary btn-sm btn-fill btn-block" onClick={() => this.handleRevealClick(rowData.pollID)}>Reveal</button>
                                                    );
                                                }
                                                else {
                                                    return (
                                                        <button disabled className="btn btn-primary btn-sm btn-fill btn-block">Claim Reward</button>
                                                    );
                                                }
                                            }

                                            if (rowData.commitPeriodActive) {
                                                return (
                                                    <button disabled className="btn btn-default btn-sm btn-block btn-fill">Reveal</button>
                                                );
                                            }

                                            if (rowData.pollEnded && rowData.voterCanClaimReward && rowData.hasBeenRevealed && rowData.voterHasReward) {
                                                return (
                                                    <button className="btn btn-block btn-primary btn-sm btn-fill" onClick={() => this.handleClaimRewardClick(rowData.pollID)}>Claim
                                                        Reward</button>
                                                );
                                            }

                                            if (rowData.pollEnded && !rowData.voterCanClaimReward || !rowData.voterHasReward) {
                                                return (
                                                    <button disabled className="btn btn-default btn-sm btn-block btn-fill">Claim Reward</button>
                                                );
                                            }

                                        }}

                                    />
                                </Table>
                            )}
                        </AutoSizer>
                    </div>

                </div>

                <Modal show={this.state.showChallengeLoadingModal}>
                    <Modal.Body>
                        <div className="row">
                            <div className="col text-center">
                                <h4>Please Update this Challenge</h4>
                                <p>This challenge needs to be updated before you can claim your tokens Please sign the transaction required to update this challenge.</p>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>

                <Modal show={this.state.showClaimLoadingModal}>
                    <Modal.Body>
                        <div className="row">
                            <div className="col text-center">
                                <h4>Claim your tokens</h4>
                                <p>Please sign the transaction required to claim your tokens.</p>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>

                <VoteUpload show={this.state.showVoteUploadModal} callback={this.state.voteUploadCallbackFunction} />
                <GenericOkModal showModal={this.state.showThankYouModal} header={"Vote Successfully Revealed"} content={"Thank you for revealing your vote, it has been recorded."} closeHandler={this.handleThankYouOKClickModal}/>
                <GenericOkModal showModal={this.state.showThankYouClaimModal} header={"Claim Successful"} content={"Thank you. Your MEDX tokens have been claimed"} closeHandler={this.handleThankYouClaimOKClickModal}/>
                <GenericLoadingModal showModal={this.state.showLoadingModal} contentText={"Waiting for transaction to be mined..."}/>
                <ErrorModal showModal={this.state.showErrorModal} closeHandler={this.handleErrorOKClickModal}/>
            </div>
        );
    }
}
