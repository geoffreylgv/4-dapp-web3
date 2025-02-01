# Class Registration Smart Contract Documentation

## Overview
The **SchoolManagement** smart contract provides a simple way to manage student enrollments in a class. It includes an **admin role** for managing registrations and allows querying of student details.

## Features
- **Admin Role**: Only the contract creator (admin) can register and remove students.
- **Student Registration**: Admin can add students with a unique ID and name.
- **Student Removal**: Admin can remove students from the registry.
- **Student Querying**: Anyone can retrieve registered student details.

## Functions

### `constructor()`
- **Description**: Initializes the contract and assigns the deployer as the admin.
- **Access**: Public

### `registerStudent(uint256 _id, string memory _name)`
- **Description**: Registers a student with a unique ID and name.
- **Parameters**:
  - `_id`: Unique student ID (uint256)
  - `_name`: Name of the student (string)
- **Access**: Only admin
- **Requirements**:
  - Student must not already be registered.

### `removeStudent(uint256 _id)`
- **Description**: Removes a student from the registry.
- **Parameters**:
  - `_id`: Unique student ID (uint256)
- **Access**: Only admin
- **Requirements**:
  - Student must exist in the registry.

### `getStudentById(uint256 _id) -> string`
- **Description**: Retrieves a student’s name by ID.
- **Parameters**:
  - `_id`: Unique student ID (uint256)
- **Returns**: The name of the student (string)
- **Access**: Public
- **Requirements**:
  - Student must be registered.

### `getAllStudents() -> uint256[]`
- **Description**: Returns a list of all registered student IDs.
- **Access**: Public
- **Returns**: Array of registered student IDs (uint256[])

## Access Control
- **Admin**: Only the contract deployer can register and remove students.
- **Public Access**: Anyone can query student information.

## Error Handling
- Functions include `require` statements to ensure correct data validation and prevent unauthorized actions.

## Example Usage
1. Deploy the contract.
2. Call `registerStudent(1, "Alice")` as the admin.
3. Call `getStudentById(1)` to retrieve Alice’s name.
4. Call `removeStudent(1)` to remove Alice from the registry.
5. Call `getAllStudents()` to see the list of registered student IDs.

## Security Considerations
- Only the admin can modify student records.
- Proper `require` checks prevent duplicate or invalid registrations.

This documentation provides a clear understanding of the contract's functionality and usage.

