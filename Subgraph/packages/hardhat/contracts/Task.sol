pragma solidity ^0.8.17;

contract TaskStorage {
    event NewTask(uint256 id, address owner, string taskName, uint256 duration);
    event UpdatedTask(uint256 id, address owner, string taskName, uint256 duration);

    struct Task {
        address owner;
        string taskName;
        uint256 duration;
    }

    Task[] public tasks;

    mapping(uint256 => address) public taskToOwner;
    mapping(address => uint256) public ownerToTask;

    function createTask(string memory name, uint256 duration) public {
        require(ownerToTask[msg.sender] == 0);
        tasks.push(Task(msg.sender, name, duration));
        uint256 id = tasks.length - 1;
        taskToOwner[id] = msg.sender;
        ownerToTask[msg.sender] = id;

        emit NewTask(id, msg.sender, name, duration);
    }

    function getTask(address owner) public view returns (string memory, uint256) {
        uint256 id = ownerToTask[owner];
        return (tasks[id].taskName, tasks[id].duration);
    }

    function updateTaskName(string memory name) public {
        require(ownerToTask[msg.sender] != 0);
        require(msg.sender == tasks[ownerToTask[msg.sender]].owner);

        uint256 id = ownerToTask[msg.sender];

        tasks[id].taskName = name;
        emit UpdatedTask(id, msg.sender, name, tasks[id].duration);
    }
}
