pragma solidity ^0.4.23;

import "openzeppelin-eth/contracts/math/SafeMath.sol";
import "openzeppelin-eth/contracts/token/ERC20/IERC20.sol";
import "./Ownable.sol";
import "./Initializable.sol";

contract BetaFaucet is Ownable {
  // Keep track of which Ethereum addresses we've sent Ether and our MEDX ERC20 token to
  mapping (address => bool) public sentEtherAddresses;
  mapping (address => bool) public sentMEDXAddresses;

  // Amount of gas we want to account for when doing require() checks
  uint256 public constant gasAmount = 1000000;

  event EtherSent(address indexed recipient, uint256 value);
  event MEDXSent(address indexed recipient, uint256 value);

  // A reference to your deployed token contract
  IERC20 public medXToken;

  // Provides a better way to do calculations via .add(), .sub(), etc.
  using SafeMath for uint256;

  // `fallback` function called when eth is sent to this contract
  function () public payable {
  }

  /**
   * @dev - Creates a new BetaFaucet contract with the given parameters
   * @param _medXTokenAddress - the address of the previously deployed Work token contract
   */
  function init(IERC20 _medXTokenAddress, address _owner) public initializer {
    require(_medXTokenAddress != address(0), 'medxtoken address is defined');
    Ownable.initialize(_owner);
    medXToken = _medXTokenAddress;
  }

  function withdrawEther() external onlyOwner {
    owner().transfer(address(this).balance.sub(gasAmount));
  }

  function sendEther(address _recipient, uint256 _amount) public onlyOwner {
    require(_recipient != address(0), "recipient address is empty");
    require(!sentEtherAddresses[_recipient], "recipient has already received ether");
    require(_amount > 0, "amount must be positive");
    require(_amount <= 1 ether, "amount must be below the upper limit");
    require(address(this).balance >= _amount.add(gasAmount), "contract is out of ether!");

    sentEtherAddresses[_recipient] = true;
    emit EtherSent(_recipient, _amount);

    _recipient.transfer(_amount);
  }

  function sendMEDX(address _recipient, uint256 _amount) public onlyOwner {
    require(_recipient != address(0), "recipient address is empty");
    require(!sentMEDXAddresses[_recipient], "recipient has already received MEDX");
    require(_amount > 0, "amount must be positive");
    require(_amount <= 1500 ether, "amount must be below the upper limit");
    require(medXToken.balanceOf(address(this)) >= _amount, "contract is out of MEDX!");

    sentMEDXAddresses[_recipient] = true;
    emit MEDXSent(_recipient, _amount);

    medXToken.transfer(_recipient, _amount);
  }
}
