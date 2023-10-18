
bool public reentrancyLock;

function transfer(address to, uint256 amount) external {
        require(!reentrancyLock);
        reentrancyLock = true;
        require(balances[msg.sender] >= amount, "Not enough tokens");

        
        balances[msg.sender] -= amount;
        balances[to] += amount;

        emit Transfer(msg.sender, to, amount);
        reentrancyLock = false;
    }
