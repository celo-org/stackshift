//SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Split is Ownable {
    using Counters for Counters.Counter;

    event ExpenseCreated(
        uint indexed index,
        address indexed creator,
        address indexed recipient,
        uint amount
    );
    event DebtorPaid(
        uint indexed index,
        address indexed recipient,
        address indexed debtor,
        uint amount
    );
    event ExpenseCancelled(
        uint indexed index,
        address indexed creator,
        address indexed recipient,
        uint amount
    );

    //pause contract during emergency
    bool _pauseContract = false;

    // mapping creator address to expense id
    mapping(address => mapping(uint => uint)) _creatorExpenses;

    // mapping debtor address to expense id
    mapping(address => mapping(uint => uint)) _debtorExpenses;

    // mapping expense id to creator id
    mapping(uint => address) _expenseCreator;

    // mapping number of creator expenses;
    mapping(address => uint) _createdExpenseOf;

    // mapping number of debtor expenses;
    mapping(address => uint) _owedExpenseOf;

    // All Expense
    mapping(uint => Expense) _allExpenses;

    Counters.Counter _expenseIndex;


    enum ExpenseStatus {
        PENDING,
        PAID,
        CANCELLED
    }

    enum ExpenseCategory {
        ACCOMODATION,
        TRANSPORTATION,
        FOOD,
        MISC
    }

    struct Participant {
        address _address;
        string name;
        string avatarURL;
    }

    struct Debtor {
        address _address;
        string name;
        string avatarURL;
        uint amount;
        bool hasPaid;
        uint paidAt;
    }

    struct Expense {
        string name;
        string description;
        ExpenseCategory category;
        address token;
        uint amount;
        uint paymentDue;
        uint createdAt;
        ExpenseStatus status;
        Participant creator;
        Participant recipient;
        Debtor[] debtors;
    }

    modifier creatorOf(uint expenseIndex) {
        require(
            _expenseCreator[expenseIndex] == msg.sender,
            "Access denied. Only creator"
        );
        _;
    }

    modifier notPaused() {
        require(!_pauseContract, "Contract is paused");
        _;
    }

    function createExpense(
        string memory _name,
        string memory _description,
        uint _amount,
        address _tokenAddress,
        ExpenseCategory _category,
        uint _paymentDue,
        Participant memory _recipient,
        Participant memory _creator,
        Debtor[] memory _debtors
    ) public notPaused {
        //data validation
        require(bytes(_name).length > 0, "Expense name is required");
        require(_amount > 0, "amount must be greater than 0");
        require(_tokenAddress != address(0), "Invalid token address or ENS names");
        require(_recipient._address != address(0), "Invalid  recipient address or ENS names");

        uint expenseIndex = _expenseIndex.current();

        //create new Expense
        Expense storage expense = _allExpenses[expenseIndex];
        expense.name = _name;
        expense.description = _description;
        expense.amount = _amount;
        expense.token = _tokenAddress;
        expense.recipient = _recipient;
        expense.creator = _creator;
        expense.createdAt = block.timestamp;
        expense.category = _category;
        expense.status = ExpenseStatus.PENDING;
        expense.paymentDue = _paymentDue;

        address creatorAddress = _creator._address;

        // get number of expenses created by `_creator`
        uint numberOfCreatorExpenses = _createdExpenseOf[creatorAddress];

        // increase the creators number of created expenses
        _createdExpenseOf[creatorAddress] += 1;

        // assign expense index to creator
        _creatorExpenses[creatorAddress][
            numberOfCreatorExpenses
        ] = expenseIndex;

        // Implicit memory to storage conversion is not supported
        // so we do it manually
        for (uint idx; idx < _debtors.length; idx++) {
            address debtorAddress = _debtors[idx]._address;

            _debtors[idx].hasPaid = false;

            _debtors[idx].paidAt = 0;

            require(debtorAddress != address(0), "invalid address debtor or ENS name");

            //get number of expense of debtor
            uint numberOfOwedExpense = _owedExpenseOf[debtorAddress];

            // increase the number of debtors owed expenses;
            _owedExpenseOf[debtorAddress] += 1;

            // assign expense index to debtor
            _debtorExpenses[debtorAddress][numberOfOwedExpense] = expenseIndex;

            // append debtor expense list of debtors
            expense.debtors.push(_debtors[idx]);
        }

        _expenseIndex.increment();

        emit ExpenseCreated(
            expenseIndex,
            _creator._address,
            _recipient._address,
            _amount
        );
    }

    function getNumberOfCreatedExpenses(address _creatorAddress)
        external
        view
        notPaused
        returns (uint)
    {
        require(_creatorAddress != address(0), "Invalid address");
        return _createdExpenseOf[_creatorAddress];
    }

    function getNumberOfOwedExpenses(address _debtorAddress)
        external
        view
        notPaused
        returns (uint)
    {
        require(_debtorAddress != address(0), "Invalid address");
        return _owedExpenseOf[_debtorAddress];
    }

    function getCreatedExpense(address _creatorAddress, uint index)
        external
        view
        notPaused
        returns (
            string memory,
            string memory,
            ExpenseCategory,
            uint,
            address,
            ExpenseStatus,
            uint,
            uint
        )
    {
        uint expenseIndex = _creatorExpenses[_creatorAddress][index];
        Expense storage expense = _allExpenses[expenseIndex];

        return (
            expense.name,
            expense.description,
            expense.category,
            expense.amount,
            expense.token,
            expense.status,
            expense.paymentDue,
            expense.createdAt
        );
    }
    function getOwedExpense(address _debtorAddress, uint index)
        external
        view
        notPaused
        returns (
            string memory,
            string memory,
            ExpenseCategory,
            uint,
            bool,
            uint,
            ExpenseStatus,
            uint,
            uint
        )
    {
        uint expenseIndex = _debtorExpenses[_debtorAddress][index];
        Expense storage expense = _allExpenses[expenseIndex];
        Debtor memory debtor;

        // Doesn't cost gas
        // But can stopped by miner if it takes too long
        for(uint idx; idx < expense.debtors.length; idx++){
            if(expense.debtors[idx]._address == _debtorAddress){
                debtor = expense.debtors[idx];
                break;
            }
        }

        return (
            expense.name,
            expense.description,
            expense.category,
            debtor.amount,
            debtor.hasPaid,
            debtor.paidAt,
            expense.status,
            expense.paymentDue,
            expense.createdAt
        );
    }

    function pauseContract(bool status) external onlyOwner {
        _pauseContract = status;
    }

}