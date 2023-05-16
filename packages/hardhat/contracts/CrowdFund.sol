// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CrowdFund {
    using SafeMath for uint256;

    enum ProjectState {
        Fundraising,
        Expired,
        Successful
    }

    struct Project {
        address payable creator;
        uint256 goalAmount;
        uint256 completeAt;
        uint256 currentBalance;
        uint256 raisingDeadline;
        string title;
        string description;
        string imageLink;
        ProjectState state;
        mapping(address => uint256) contributions;
    }

    Project[] public projects;
    IERC20 public cUSDToken;

    event ProjectStarted(
        address contractAddress,
        address projectCreator,
        string title,
        string description,
        string imageLink,
        uint256 fundRaisingDeadline,
        uint256 goalAmount
    );

    event ReceivedFunding(address projectAddress, address contributor, uint256 amount, uint256 currentTotal);

    event CreatorPaid(address projectAddress, address recipient);

    modifier theState(uint256 projectId, ProjectState projectState) {
    require(projectId < projects.length, "Invalid project ID");
    Project storage project = projects[projectId];
    require(project.state == projectState, "Invalid project state");
    _;
}

    constructor(IERC20 _cUSDToken) {
        cUSDToken = _cUSDToken;
    }

   function startProject(
    string calldata title,
    string calldata description,
    string calldata imageLink,
    uint256 durationInDays,
    uint256 amountToRaise
) external {
    uint256 raiseUntil = block.timestamp.add(durationInDays.mul(1 days));

    Project storage newProject = projects.push();
    newProject.creator = payable(msg.sender);
    newProject.goalAmount = amountToRaise;
    newProject.completeAt = 0;
    newProject.currentBalance = 0;
    newProject.raisingDeadline = raiseUntil;
    newProject.title = title;
    newProject.description = description;
    newProject.imageLink = imageLink;
    newProject.state = ProjectState.Fundraising;

    emit ProjectStarted(
        address(this),
        msg.sender,
        title,
        description,
        imageLink,
        raiseUntil,
        amountToRaise
    );
}

    function contribute(uint256 projectId, uint256 amount) external {
        require(projectId < projects.length, "Invalid project ID");
        Project storage project = projects[projectId];
        require(project.state == ProjectState.Fundraising, "Project not in fundraising state");
        require(amount > 0, "Invalid contribution amount");

        cUSDToken.transferFrom(msg.sender, address(this), amount);

        project.contributions[msg.sender] = project.contributions[msg.sender].add(amount);
        project.currentBalance = project.currentBalance.add(amount);
        emit ReceivedFunding(address(this), msg.sender, amount, project.currentBalance);

        checkIfFundingExpired(projectId);
    }

    function checkIfFundingExpired(uint256 projectId) public {
        require(projectId < projects.length, "Invalid project ID");
        Project storage project = projects[projectId];

        if (block.timestamp > project.raisingDeadline) {
            project.state = ProjectState.Expired;
        }
    }

    function payOut(uint256 projectId) external returns (bool) {
        require(projectId < projects.length, "Invalid project ID");
        Project storage project = projects[projectId];
        require(msg.sender == project.creator, "Only project creator can call this function");

        uint256 totalRaised = project.currentBalance;
        project.currentBalance = 0;

        if (cUSDToken.transfer(msg.sender, totalRaised)) {
emit CreatorPaid(address(this), msg.sender);
project.state = ProjectState.Successful;
return true;
} else {
project.currentBalance = totalRaised;
project.state = ProjectState.Successful;
}
    return false;
}

function getProjectDetails(uint256 projectId)
    external
    view
    returns (
        address payable projectCreator,
        string memory projectTitle,
        string memory projectDescription,
        string memory projectImageLink,
        uint256 fundRaisingDeadline,
        ProjectState currentState,
        uint256 projectGoalAmount,
        uint256 currentAmount
    )
{
    require(projectId < projects.length, "Invalid project ID");
    Project storage project = projects[projectId];

    projectCreator = project.creator;
    projectTitle = project.title;
    projectDescription = project.description;
    projectImageLink = project.imageLink;
    fundRaisingDeadline = project.raisingDeadline;
    currentState = project.state;
    projectGoalAmount = project.goalAmount;
    currentAmount = project.currentBalance;
}

function getContributions(uint256 projectId, address contributor) external view returns (uint256) {
    require(projectId < projects.length, "Invalid project ID");
    Project storage project = projects[projectId];
    return project.contributions[contributor];
}

function getProjectCount() external view returns (uint256) {
    return projects.length;
}
}









