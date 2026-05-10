// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CrateTracker {
    address public owner;

    struct CrateEvent {
        string crateId;
        uint256 timestamp;
        string riskScore;
        string dataHash;
        string eventType; // e.g., "SHOCK", "TEMPERATURE_ANOMALY"
    }

    // Mapping from Crate ID to an array of events
    mapping(string => CrateEvent[]) private crateEvents;

    event CrateEventLogged(
        string indexed crateId,
        uint256 timestamp,
        string riskScore,
        string dataHash,
        string eventType
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner (Admin) can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Log a critical event for a crate to the blockchain.
     * Only the trusted Admin (Express Backend) can log these to ensure data integrity
     * before hashing.
     */
    function logCrateEvent(
        string memory _crateId,
        uint256 _timestamp,
        string memory _riskScore,
        string memory _dataHash,
        string memory _eventType
    ) public onlyOwner {
        CrateEvent memory newEvent = CrateEvent({
            crateId: _crateId,
            timestamp: _timestamp,
            riskScore: _riskScore,
            dataHash: _dataHash,
            eventType: _eventType
        });

        crateEvents[_crateId].push(newEvent);

        emit CrateEventLogged(_crateId, _timestamp, _riskScore, _dataHash, _eventType);
    }

    /**
     * @dev Retrieve the entire event history for a specific crate.
     */
    function getEventHistory(string memory _crateId) public view returns (CrateEvent[] memory) {
        return crateEvents[_crateId];
    }
}
