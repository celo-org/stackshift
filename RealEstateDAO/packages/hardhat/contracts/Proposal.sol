// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./DAONFT.sol";
import "hardhat/console.sol";

contract DAO is Ownable {
    // We will write contract code here
    // Create a struct named Proposal containing all relevant information

    uint256 public interest = 5;

    struct Proposal {
        uint256 proposalId;
        string title;
        string description;
        uint256 mortgageId;
        address creator;
        // deadline - the UNIX timestamp until which this proposal is active. Proposal can be executed after the deadline has been exceeded.
        uint256 deadline;
        // yesVotes - number of yay votes for this proposal
        uint256 yesVotes;
        // noVotes - number of nay votes for this proposal
        uint256 noVotes;
        // abstainVotes - number of nay votes for this proposal
        uint256 abstainVotes;
        // executed - whether or not this proposal has been executed yet. Cannot be executed before the deadline has been exceeded.
        bool executed;
    }

    struct Mortgage {
        string name;
        uint256 income;
        string incomeImage;
        uint256 minRepay;
        address daoAdress;
        string mortDesc;
        string mortImage;
        uint256 mortAmount;
        uint256 mortAmountwithInterest;
        address creator;
        uint256 mortgageId;
        uint256 status; // 0 1, 2
    }

    // Create a mapping of ID to Proposal
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => Mortgage) public mortgages;
    mapping(address => mapping(uint256 => uint256)) public repayment;
    mapping(address => mapping(uint256 => bool)) public voteStatus;
    mapping(address => bool) public mortgageGiven;

    // Number of proposals that have been created
    uint256 public numProposals;
    uint256 public numMortgages;

    IERC721 daoNFT;
    address vault;

    constructor(address _nft) payable {
        daoNFT = IERC721(_nft);
        vault = _nft;
    }

    modifier nftHolderOnly() {
        require(daoNFT.balanceOf(msg.sender) > 0, "NOT_A_DAO_MEMBER");
        _;
    }

    function createProposal(string memory title, string memory description) public nftHolderOnly {
        Proposal storage proposal = proposals[numProposals];
        proposal.creator = msg.sender;
        proposal.title = title;
        proposal.description = description;
        // Set the proposal's voting deadline to be (current time + 5 minutes)
        proposal.deadline = block.timestamp + 1 days;
        proposal.proposalId = numProposals;

        numProposals++;
    }

    function createMortgage(
        string memory name,
        uint256 income,
        string memory incomeImage,
        uint256 minRepay,
        address daoAddress,
        string memory mortDesc,
        string memory mortImage,
        uint256 mortAmount
    ) external {
        require(mortgageGiven[msg.sender] == false, "You have received a mortgage");
        Mortgage storage mortgage = mortgages[numMortgages];

        mortgage.name = name;
        mortgage.creator = msg.sender;
        mortgage.income = income;
        mortgage.incomeImage = incomeImage;
        mortgage.daoAdress = daoAddress;
        mortgage.mortDesc = mortDesc;
        mortgage.mortImage = mortImage;
        mortgage.mortAmount = mortAmount;
        mortgage.minRepay = minRepay;
        mortgage.mortgageId = numMortgages;

        if (daoNFT.balanceOf(msg.sender) > 0) {
            Proposal storage proposal = proposals[numProposals];
            proposal.creator = msg.sender;
            proposal.mortgageId = numMortgages;
            proposal.title = name;
            proposal.description = mortDesc;
            mortgage.status = 1;
            mortgage.mortAmountwithInterest = mortAmount;
            proposal.proposalId = numProposals;

            proposal.deadline = block.timestamp + 1 days;

            numProposals++;
        }

        numMortgages++;
    }

    function getMortgage() public view returns (Mortgage[] memory) {
        uint256 currentIndex = 0;
        uint256 itemCount = 0;

        for (uint256 i = 0; i < numMortgages; i++) {
            if (mortgages[i].daoAdress == msg.sender && mortgages[i].status == 0) {
                itemCount += 1;
            }
        }

        Mortgage[] memory items = new Mortgage[](itemCount);

        for (uint256 i = 0; i < numMortgages; i++) {
            if (mortgages[i].daoAdress == msg.sender && mortgages[i].status == 0) {
                uint256 currentId = i;

                Mortgage storage currentItem = mortgages[currentId];
                items[currentIndex] = currentItem;

                currentIndex += 1;
            }
        }
        return items;
    }

    function getProposals() public view returns (Proposal[] memory) {
        uint256 currentIndex = 0;
        uint256 itemCount = 0;

        for (uint256 i = 0; i < numProposals; i++) {
            itemCount += 1;
        }

        Proposal[] memory items = new Proposal[](itemCount);

        for (uint256 i = 0; i < numProposals; i++) {
            uint256 currentId = i;

            Proposal storage currentItem = proposals[currentId];
            items[currentIndex] = currentItem;

            currentIndex += 1;
        }
        return items;
    }

    function approveMort(uint256 mortgageId, uint256 approveVote) public {
        require(msg.sender == mortgages[mortgageId].daoAdress, "No access");
        Mortgage memory mort = mortgages[mortgageId];
        if (approveVote == 1) {
            console.log(numProposals);
            Proposal storage proposal = proposals[numProposals];
            proposal.creator = mort.creator;
            proposal.mortgageId = mortgageId;
            proposal.title = mort.name;
            proposal.description = mort.mortDesc;
            proposal.proposalId = numProposals;

            mortgages[mortgageId].status = 1;
            uint256 interestAmount = mort.mortAmount * interest / 100;
            mortgages[mortgageId].mortAmountwithInterest = interestAmount + mort.mortAmount;

            proposal.deadline = block.timestamp + 1 days;

            numProposals++;
        } else {
            mortgages[mortgageId].status = 2;
        }
    }

    modifier activeProposalOnly(uint256 proposalIndex) {
        require(proposals[proposalIndex].deadline > block.timestamp, "DEADLINE_EXCEEDED");
        _;
    }

    // Create an enum named Vote containing possible options for a vote
    enum Vote {
        Yes, // YAY = 0
        No, // NAY = 1
        Abstain // ABSTAIN = 2
    }

    function voteOnProposal(uint256 proposalIndex, Vote vote)
        external
        nftHolderOnly
        activeProposalOnly(proposalIndex)
    {
        require(voteStatus[msg.sender][proposalIndex] == false, "you have already voted");

        Proposal storage proposal = proposals[proposalIndex];

        uint256 voterNFTBalance = daoNFT.balanceOf(msg.sender);

        if (vote == Vote.Yes) {
            proposal.yesVotes += voterNFTBalance;
        } else if (vote == Vote.No) {
            proposal.noVotes += voterNFTBalance;
        } else {
            proposal.abstainVotes += voterNFTBalance;
        }

        voteStatus[msg.sender][proposalIndex] = true;
    }

    modifier inactiveProposalOnly(uint256 proposalIndex) {
        require(proposals[proposalIndex].deadline <= block.timestamp, "DEADLINE_NOT_EXCEEDED");
        require(proposals[proposalIndex].executed == false, "PROPOSAL_ALREADY_EXECUTED");
        _;
    }

    function executeProposal(uint256 proposalIndex) external nftHolderOnly inactiveProposalOnly(proposalIndex) {
        Proposal storage proposal = proposals[proposalIndex];
        require(proposal.yesVotes > proposal.noVotes, "Failed Proposal");

        proposal.executed = true;
        uint256 amount = mortgages[proposal.mortgageId].mortAmount;

        if (proposal.yesVotes > proposal.noVotes) {
            mortgageGiven[mortgages[proposal.mortgageId].creator] = true;
            DAONFT(payable(vault)).withdraw(amount);
            (bool success,) = proposal.creator.call{value: amount}("");
            require(success, "Failed to send Ether");
        }
    }

    function payLoan(uint256 proposalIndex) public payable {
        require(msg.value > 0, "value must be greater than zero");
        require(
            repayment[msg.sender][proposalIndex] < mortgages[proposals[proposalIndex].mortgageId].mortAmountwithInterest,
            "Loan has been fully paid"
        );
        repayment[msg.sender][proposalIndex] = msg.value;
        (bool success,) = address(this).call{value: msg.value}("");
        require(success, "Failed to send Ether");
    }

    function setInterest(uint256 val) public onlyOwner {
        interest = val;
    }

    receive() external payable {}

    fallback() external payable {}
}
