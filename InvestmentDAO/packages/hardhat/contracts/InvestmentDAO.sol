// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

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
    Proposal[] public proposals;
    Voter[] public voters;
    Member[] public members;

    uint256 public proposalCount;
    uint256 public votingPeriod;
    uint256 public memberCount;

    mapping(address => mapping(uint256 => bool)) hasVoted;
    mapping(address => Member) public membersMap;
    // mapping(address => bool) public hasJoined;

    event AddMember(address memberAddress, uint256 tokenBalance);
    event ProposalCreated(uint256 proposalId, string title, string description, uint256 startTime, uint256 endTime);
    event Voted(uint256 proposalId, address voter, uint256 choice, uint256 yesVotes, uint256 noVotes);
    
       bool internal locked;

    modifier noReentrant() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }

    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
        owner = payable(msg.sender);
        // membersMap[owner].memberAddress = payable(msg.sender);
        // members.push(Member(msg.sender, token.balanceOf(msg.sender)));
    }

    modifier onlyOwner {
        msg.sender == owner;
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

    function addMember() public {
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
        require(token.balanceOf(msg.sender) > 0, "You must hold tokens to create a proposal");
        require(_startTime > block.timestamp, "Proposal start time must be in the future");
        require(_endTime > _startTime, "Proposal end time must be after start time");
        require(membersMap[msg.sender].memberAddress == msg.sender, "You are not yet a member of this community");
        proposals.push(Proposal(proposalCount, msg.sender, _title, _description, _startTime, _endTime, 0, 0));
        proposalCount++;
        emit ProposalCreated(proposals.length - 1, _title, _description, _startTime, _endTime);
    }

    function vote(uint256 _proposalIndex, uint256 _choice) external onlyMember votingOngoing(proposals[_proposalIndex].startTime, proposals[_proposalIndex].endTime){
        require(_proposalIndex < proposalCount, "Invalid proposal index");
        require(!hasVoted[msg.sender][_proposalIndex], "You have already voted for this proposal");
        require(token.balanceOf(msg.sender) > 0, "You must hold tokens to vote");
        require(membersMap[msg.sender].memberAddress == msg.sender, "You are not yet a member of this community");

        if (_choice == 1) {
            proposals[_proposalIndex].yesVotes += 1;
        } else {
            proposals[_proposalIndex].noVotes += 1;
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
        uint256 noVotes
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
            proposal.noVotes
        );
    }

    function endVoting(uint256 _proposalIndex) external noReentrant { 
        require(_proposalIndex < proposalCount, "Invalid proposal index");
        require(proposals[_proposalIndex].creator == msg.sender, "Only the creator of the proposal can end the voting");

        Proposal memory proposal = proposals[_proposalIndex];
        require(block.timestamp >= votingPeriod, "Voting period has not ended yet");

        if (proposal.yesVotes > proposal.noVotes) {
            // Execute the proposal if it has more yes votes
            // (e.g., transfer funds, call external contract, etc.)
            // ...
        } else {
            // Reject the proposal if it has more no votes
            // ...
        }
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
}