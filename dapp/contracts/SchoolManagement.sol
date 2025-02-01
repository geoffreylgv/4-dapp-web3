// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract SchoolManagement {
    address public admin;
    
    struct Student {
        uint256 id;
        string name;
        bool isRegistered;
    }
    
    mapping(uint256 => Student) private students;
    uint256[] private studentIds;
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only the admin can perform this action");
        _;
    }
    
    constructor() {
        admin = msg.sender;
    }
    
    function registerStudent(uint256 _id, string memory _name) public onlyAdmin {
        require(!students[_id].isRegistered, "Student already registered");
        students[_id] = Student(_id, _name, true);
        studentIds.push(_id);
    }
    
    function removeStudent(uint256 _id) public onlyAdmin {
        require(students[_id].isRegistered, "Student not found");
        delete students[_id];
        
        for (uint256 i = 0; i < studentIds.length; i++) {
            if (studentIds[i] == _id) {
                studentIds[i] = studentIds[studentIds.length - 1];
                studentIds.pop();
                break;
            }
        }
    }
    
    function getStudentById(uint256 _id) public view returns (string memory) {
        require(students[_id].isRegistered, "Student not found");
        return students[_id].name;
    }
    
    function getAllStudents() public view returns (uint256[] memory) {
        return studentIds;
    }
}
