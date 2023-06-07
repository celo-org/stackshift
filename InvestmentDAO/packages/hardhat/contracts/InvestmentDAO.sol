// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./NFTMarketPlace.sol";
import "./Token.sol";

contract InvestmentDAO {
    struct Proposal {
        uint256 id;
        address creator;
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        uint256 yesVotes;
        uint256 noVotes;
        bool executed;
    }

    struct Voter {
       uint256 proposerIndex;
       address voterAddress;
       uint256 voteChoice;
    }

    struct Member {
        address memberAddress;
        uint256 tokenBalance;
    }

    enum ProposalStatus { Pending, Active, Closed }

    address payable owner;
    IERC20 public token;
    ERC1155 public nft;
    Proposal[] public proposals;
    Voter[] public voters;
    Member[] public members;
    address[] whiteList;
    address[] blacklist;
    uint256 public proposalCount;
    uint256 public votingPeriod;
    uint256 public memberCount;

    mapping(address => mapping(uint256 => bool)) hasVoted;
    mapping(address => Member) public membersMap;
    mapping(address => bool) public whiteListed;
    mapping (address => bool) public blackListed;

    event AddMember(address memberAddress, uint256 tokenBalance);
    event ProposalCreated(uint256 proposalId, string title, string description, uint256 startTime, uint256 endTime);
    event Voted(uint256 proposalId, address voter, uint256 choice, uint256 yesVotes, uint256 noVotes);
    
    NFTMarketplace private nftMarketPlace;
    Token private mtToken;

    constructor(address _tokenAddress, address _nft) {
        token = IERC20(_tokenAddress);
        nft = ERC1155(_nft);
        mtToken = new Token();
        nftMarketPlace = new NFTMarketplace();
        owner = payable(msg.sender);
        membersMap[owner].memberAddress = payable(msg.sender);
        whiteListed[owner] = true;
        // members.push(Member(msg.sender, token.balanceOf(msg.sender)));
    }

    bool internal locked;

    modifier noReentrant() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }

    modifier onlyOwner {
        msg.sender == owner;
        _;
    } 

    modifier onlyWhitListed {
      require(!whiteListed[msg.sender], "Already whiteListed");
      whiteListed[msg.sender] = true;
      _;
     whiteListed[msg.sender] = false;
    } 

    modifier onlyBlacklist{
     require(!whiteListed[msg.sender], "Already whiteListed");
      whiteListed[msg.sender] = true;
      _;
     whiteListed[msg.sender] = false;
    } 

    modifier nftHolderOnly(uint256 tokenId) {
        require(nft.balanceOf(msg.sender, tokenId) > 0, "You don't have the NFT");
        _;
    }

      modifier onlyTokenHolders() {
        require(token.balanceOf(msg.sender) > 0, "You don't have the dao token");
        _;
    }

    modifier activeProposalOnly(uint256 _proposalIndex) {
        require(proposals[_proposalIndex].endTime > block.timestamp, "Proposal expired");
        _;
    }

    modifier OnlyExecutionPeriod(uint256 _proposalIndex) {
        //execution should be done after a day to the close of the proposal
        require(proposals[_proposalIndex].endTime + 1 days > block.timestamp, "Not yet execution period");
        _;
    }
    
    modifier votingOngoing(uint256 _startTime, uint256 _endTime) {
        require(block.timestamp >= _startTime, "Voting has not started yet");
        require(block.timestamp <= _endTime, "Voting has already ended");
    _;
    }

    modifier onlyMember(){
        require(membersMap[msg.sender].memberAddress == msg.sender, "You are not yet a member of this community");
        _;
    }

    function addMember() public onlyTokenHolders  {
        require(msg.sender != address(0), "Invalid address");
    
        // Check if member already exists
        require(membersMap[msg.sender].memberAddress == address(0), "Already a member");
        
        // Add new member
        Member storage member = membersMap[msg.sender];
        member.memberAddress = msg.sender;
        member.tokenBalance =  token.balanceOf(msg.sender);
        members.push(Member(msg.sender, token.balanceOf(msg.sender)));
        memberCount++;
        emit AddMember(msg.sender, token.balanceOf(msg.sender));
    }

    function createProposal(string calldata _title, string calldata _description, uint256 _startTime, uint256 _endTime) external onlyMember {
        require(token.balanceOf(msg.sender) > 100 ether, "You must hold up to 100 tokens to create a proposal");
        require(_startTime > block.timestamp, "Proposal start time must be in the future");
        require(_endTime > _startTime, "Proposal end time must be after start time");
        require(membersMap[msg.sender].memberAddress == msg.sender, "You are not yet a member of this community");
        proposals.push(Proposal(proposalCount, msg.sender, _title, _description, _startTime, _endTime, 0, 0, false));
        proposalCount++;
        emit ProposalCreated(proposals.length - 1, _title, _description, _startTime, _endTime);
    }

    function vote(uint256 _proposalIndex, uint256 _choice) external onlyMember votingOngoing(proposals[_proposalIndex].startTime, proposals[_proposalIndex].endTime){
        require(_proposalIndex < proposalCount, "Invalid proposal index");
        require(!hasVoted[msg.sender][_proposalIndex], "You have already voted for this proposal");
        require(token.balanceOf(msg.sender) > 50 ether, "You must hold up to 50 tokens to vote");
        require(membersMap[msg.sender].memberAddress == msg.sender, "You are not yet a member of this community");
        uint256 voterMtTokenBalance = token.balanceOf(msg.sender);

        if (_choice == 1) {
            proposals[_proposalIndex].yesVotes += voterMtTokenBalance;
        } else {
            proposals[_proposalIndex].noVotes += voterMtTokenBalance;
        }
        voters.push(Voter(_proposalIndex, msg.sender, _choice));
        hasVoted[msg.sender][_proposalIndex] = true; // Record the vote of the user for the current proposal

        emit Voted(_proposalIndex, msg.sender, _choice, proposals[_proposalIndex].yesVotes, proposals[_proposalIndex].noVotes);

    }

    function getProposal(uint256 _proposalIndex) external view returns (
        address creator,
        string memory title,
        string memory description,
        uint256 startTime,
        uint256 endTime,
        uint256 yesVotes,
        uint256 noVotes,
        bool executed
    ) {
        require(_proposalIndex < proposalCount, "Invalid proposal index");
        Proposal memory proposal = proposals[_proposalIndex];
        return (
            proposal.creator,
            proposal.title,
            proposal.description,
            proposal.startTime,
            proposal.endTime,
            proposal.yesVotes,
            proposal.noVotes,
            proposal.executed
        );
    }

    function executeProposal(uint256 _proposalIndex, uint256 _nftId) payable external onlyOwner OnlyExecutionPeriod(_proposalIndex) noReentrant { 
        require(_proposalIndex < proposalCount, "Invalid proposal index");
        require(proposals[_proposalIndex].executed, "Proposal already executed");
        Proposal memory proposal = proposals[_proposalIndex];
        require(block.timestamp >= votingPeriod, "Voting period has not ended yet");

        if (proposal.yesVotes > proposal.noVotes) {
            // Execute the proposal if it has more yes votes
            // (e.g., transfer funds, call external contract, etc.)
            // ...
            //transfer fund to creator
            // (bool sent, bytes memory data) = proposal.creator.call{value: msg.value}("");
            require(address(this).balance > msg.value, "insufficient balance");
            nftMarketPlace.buy(_nftId);
            proposal.executed = true;
        } else {
            // Reject the proposal if it has more no votes
            // ...
        }
    }

    function stakeToken(uint256 amount) external noReentrant {
        require(membersMap[msg.sender].memberAddress == msg.sender, "You are not yet a member of this DAO");
        require(token.balanceOf(msg.sender) > 0 ether, "Insufficient token balance");
        payable(address(this)).transfer(amount);
    }

    function removeProposal(uint256 proposalId) external returns (Proposal memory) {
        require(proposalId < proposalCount, "Invalid proposal index");
        require(proposals[proposalId].creator == msg.sender, "Only the creator of the proposal can remove the proposal");
        require(proposals.length > 0 ether, "Proposal is empty");

        // Remove and return the last item from the array
        Proposal storage lastItem = proposals[proposals.length - 1];
        proposals.pop();

        return lastItem;         
        // Update the proposalCount by decrementing it
    }
    function removeMember(address _memberAddress) external onlyOwner noReentrant {
        require(membersMap[_memberAddress].memberAddress == _memberAddress, "Member does not exist");
        if(token.balanceOf(_memberAddress) > 0){
            require(token.balanceOf(address(this)) > 0, "Insufficient token balance");
            payable(address(this)).transfer(token.balanceOf(_memberAddress)/100);
            members[members.length - 1];
            members.pop();
        }
    }

    function buyToken(address _receiver, uint256 amount) external noReentrant {
        require(token.balanceOf(address(this)) > amount, "Insufficient token balance");
        // current mt token price. For every 100 MT token buyer pays 1 CELO
        token.transferFrom(address(this), _receiver, amount);
        payable(address(this)).transfer(amount/100 ether);
    }

     function buyNFT(uint256 _tokenId) payable external noReentrant {
        require(msg.sender.balance > 0, "Insufficient  balance");
        nftMarketPlace.buy(_tokenId);
    }

    function getAllProposals() public view returns(Proposal[] memory){
        return proposals;
    }

    function getVoters() public view returns(Voter[] memory){
        return voters;
    }
    
    function getMembers() public view returns(Member[] memory){
        return members;
    }

    function getTokenBalance(address _address) public view returns(uint256) {
        return token.balanceOf(_address);
    }

   function getProposalStatus(uint256 _proposalIndex) public view returns (uint256) {
        ProposalStatus status;
        // uint256 _status = 0;
        if (block.timestamp < proposals[_proposalIndex].startTime) {
            //proposal is pending
            status = ProposalStatus.Pending;
        } else if (block.timestamp <= proposals[_proposalIndex].endTime) {
            //proposal is active
            status = ProposalStatus.Active;
        } else if (block.timestamp > proposals[_proposalIndex].endTime) {
            //proposal voting has ended
            status = ProposalStatus.Closed;
        }
        return uint256(status);
    }

    function getMemberVoteStatus(uint256 proposalId, address _address ) public view returns(bool){
        return hasVoted[_address][proposalId];
    }

    function getMemberStatus(address _address) public view returns(bool){
        return membersMap[_address].memberAddress == _address;
    }

    function getTreasuryBalance() public view returns(uint256){
       return address(this).balance;
    }

    function getDAOATokenBalance() public view returns(uint256) {
        return token.balanceOf(address(this));
    }
}