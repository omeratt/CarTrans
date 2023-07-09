// SPDX-License-Identifier: MIT
import "@openzeppelin/contracts/utils/Strings.sol";
pragma solidity >=0.8.0;

contract CarSaleDatabase {
    struct CarSale {
        address payable owner;
        address payable buyer;
        address payable thirdParty;
        uint256 sellingPrice;
        uint256 transferredValue;
        bool keysDelivered;
        bool paymentDelivered;
        bool ownershipTransferred;
        bool canceled;
        string carBrand;
        string contractId;
    }

    mapping(string => CarSale) public carSales;
    uint carSalesCount=1;
    string[] public contractIds;
    

    function createSale(
        address payable _buyer,
        address payable _thirdParty,
        uint256 _sellingPrice,
        string memory _contractId,
        string memory _carBrand

    ) public {
        
        carSales[_contractId] = CarSale({
            owner: payable(msg.sender),
            buyer: _buyer,
            thirdParty: _thirdParty,
            sellingPrice: _sellingPrice,
            transferredValue: 0,
            keysDelivered: false,
            paymentDelivered: false,
            ownershipTransferred: false,
            canceled: false,
            carBrand: _carBrand,
            contractId: _contractId
        });
        carSalesCount += 1;
        contractIds.push(_contractId);
    }

    function confirmPayment(string memory _id) public payable {
        CarSale storage sale = carSales[_id];
        require(msg.sender == sale.buyer, "Only the buyer can confirm the payment.");
        require(msg.value >= sale.sellingPrice, "Transferred amount is less than the selling price.");
        sale.transferredValue += msg.value;
        sale.paymentDelivered = true;
    }

    function confirmKeysDelivery(string memory _id) public {
        CarSale storage sale = carSales[_id];
        require(msg.sender == sale.owner, "Only the owner can confirm the delivery of keys.");
        sale.keysDelivered = true;
    }

    function confirmOwnershipTransfer(string memory _id) public {
        CarSale storage sale = carSales[_id];
        require(msg.sender == sale.thirdParty, "Only the third party can confirm the ownership transfer.");
        require(sale.keysDelivered, "The keys must be delivered before ownership can be transferred.");
        require(sale.paymentDelivered, "The payment must be delivered before ownership can be transferred.");
        sale.ownershipTransferred = true;
        sale.owner.transfer(sale.transferredValue);
    }


    function cancelDeal(string memory _id) public {
        CarSale storage sale = carSales[_id];
        require(msg.sender == sale.buyer || msg.sender == sale.owner, "Only the buyer or owner can cancel the deal.");
        require(!sale.ownershipTransferred, "The deal cannot be cancelled after ownership transfer.");
        require(!(sale.keysDelivered && sale.paymentDelivered), "The deal cannot be cancelled after keys and payment delivery.");
        
        sale.buyer.transfer(sale.transferredValue);
        sale.transferredValue = 0;
        sale.paymentDelivered = false;
        sale.canceled = true;
        sale.keysDelivered =false;
    }

    function getAllContractIds() public view returns (string[] memory) {
        return contractIds;
    }

function getUntransferredContracts() public view returns (CarSale[] memory) {
    CarSale[] memory untransferredContracts = new CarSale[](contractIds.length);
    uint256 count = 0;

    for (uint256 i = 0; i < contractIds.length; i++) {
        string memory contractId = contractIds[i];
        CarSale storage sale = carSales[contractId];

        if (!sale.ownershipTransferred &&
            sale.buyer != address(0) &&
            sale.paymentDelivered &&
            sale.keysDelivered) {
            
            untransferredContracts[count] = sale;
            count++;
        }
    }

    // Resize the array to remove any unused elements
    assembly { mstore(untransferredContracts, count) }

    return untransferredContracts;
}

function getContractsByBuyer(address buyerId) public view returns (CarSale[] memory) {
    CarSale[] memory contractsByBuyer = new CarSale[](contractIds.length);
    uint256 count = 0;

    for (uint256 i = 0; i < contractIds.length; i++) {
        string memory contractId = contractIds[i];
        CarSale storage sale = carSales[contractId];

        if (sale.buyer == buyerId && !sale.canceled) {
            contractsByBuyer[count] = sale;
            count++;
        }
    }

    // Resize the array to remove any unused elements
    assembly { mstore(contractsByBuyer, count) }

    return contractsByBuyer;
}
function getContractsBySeller(address sellerId) public view returns (CarSale[] memory) {
    CarSale[] memory contractsBySeller = new CarSale[](contractIds.length);
    uint256 count = 0;

    for (uint256 i = 0; i < contractIds.length; i++) {
        string memory contractId = contractIds[i];
        CarSale storage sale = carSales[contractId];

        if (sale.owner == sellerId && !sale.canceled) {
            contractsBySeller[count] = sale;
            count++;
        }
    }

    // Resize the array to remove any unused elements
    assembly { mstore(contractsBySeller, count) }

    return contractsBySeller;
}



}