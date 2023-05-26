
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DaoAnalyzer {

  IERC20 public token;

  uint256 public proposalCount;
  uint256 public votingThreshold;
  uint256 public proposalThreshold;
  Member[] public members;
  Proposal[] public proposals;
  Voter[] public voters;

  mapping(address => Member) public membersMap;
  mapping(address => mapping(uint256 => bool)) hasVoted;

  struct Member {
    address memberAddress;
    uint256 tokenBalance;
  }

  struct Proposal {
    address creator;
    string title;
    string description;
    uint256 yesVotes;
    uint256 noVotes;
    bool executed;
    uint256 start;
    uint256 end;
  }

  struct Voter {
    uint256 proposalIndex;
    address voterAddress;
    bool inSupport;
  }

  event ProposalCreated(uint proposalId, address creator, string description);
  event Voted(uint proposalId, address voter, bool inSupport);
  event ProposalExecuted(uint proposalId, address executor);
  event AddMember(address memberAddress, uint256 tokenBalance);

  constructor(address _tokenAddress) {
    token = IERC20(_tokenAddress);
    votingThreshold = 50;
    proposalThreshold = 100;
  }

  function joinDao() public {
    require(msg.sender != address(0), "Invalid address");

    // Check if member already exists
    require(membersMap[msg.sender].memberAddress == address(0), "Already a member");

    // Add new member
    Member storage member = membersMap[msg.sender];
    member.memberAddress = msg.sender;
    member.tokenBalance =  token.balanceOf(msg.sender);
    members.push(Member(msg.sender, token.balanceOf(msg.sender)));

    emit AddMember(msg.sender, token.balanceOf(msg.sender));
  }

  function createProposal(string memory _title, string memory _description, uint256 _start, uint256 _end) public {

    require(_start > block.timestamp, "Proposal start time must be in the future");
    require(_end > _start, "Proposal end time must be after start time");
    require(membersMap[msg.sender].memberAddress == msg.sender, "You are not yet a member of this community");
    require(token.balanceOf(msg.sender) >= proposalThreshold , "Did not meet proposal threshold");

    proposals.push(Proposal(msg.sender, _title, _description, 0, 0, false, _start, _end));

    proposalCount++;

    emit ProposalCreated(proposalCount, msg.sender, _description);
  }

  function getProposal(uint256 _index) public view returns(address, string memory, string memory, uint, uint, bool, uint256, uint256) {

    Proposal storage proposal = proposals[_index];

    return (
      proposal.creator,
      proposal.title,
      proposal.description,
      proposal.yesVotes,
      proposal.noVotes,
      proposal.executed,
      proposal.start,
      proposal.end
    );
  }

  function getAllProposals() public view returns(Proposal[] memory){
    return proposals;
  }

  function getMembers() public view returns(Member[] memory){
    return members;
  }


  function vote(uint _proposalId, bool _inSupport) public {
    Proposal storage proposal = proposals[_proposalId];

    require(proposal.creator != address(0), "Proposal does not exist");
    require(!proposal.executed, "Proposal has already been executed");
    require(!hasVoted[msg.sender][_proposalId], "You have already voted for this proposal");

    if (_inSupport) {
        proposal.yesVotes++;
    } else {
        proposal.noVotes++;
    }

    voters.push(Voter(_proposalId, msg.sender, _inSupport));
    hasVoted[msg.sender][_proposalId] = true;
    emit Voted(_proposalId, msg.sender, _inSupport);
  }

  function executeProposal(uint _proposalId) public {
    Proposal storage proposal = proposals[_proposalId];
    require(proposal.creator != address(0), "Proposal does not exist");
    require(!proposal.executed, "Proposal has already been executed");

    uint totalVotes = proposal.yesVotes + proposal.noVotes;
    require(totalVotes > 0, "No votes cast for the proposal");

    require(proposal.yesVotes > proposal.noVotes, "Proposal did not pass");

    proposal.executed = true;

    emit ProposalExecuted(_proposalId, msg.sender);
  }

  function memberBalance(address _memberAddress) private view returns(uint256) {
    return token.balanceOf(_memberAddress);
  }

}