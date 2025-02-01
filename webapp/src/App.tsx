import { useState } from 'react'

declare global {
  interface Window {
    ethereum: any;
  }
}

import './App.css'
import { ethers } from 'ethers';

const contractAddress = '0x6f036bC00aeFE453f38316d55adAD0C54a2A91dB';
const contractABI = [
  { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
  { "inputs": [], "name": "admin", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "getAllStudents", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }], "name": "getStudentById", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }, { "internalType": "string", "name": "_name", "type": "string" }], "name": "registerStudent", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }], "name": "removeStudent", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
];

function App() {
  const [studentName, SetStudentName] = useState('');
  const [studentId, SetStudentId] = useState('');
  const [students, setStudents] = useState<any[]>([]);

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function registerStudent() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      const transaction = await contract.registerStudent(studentId, studentName);
      await transaction.wait();
      alert(`${studentName} is now registered`);
      getAllStudents(); // Fetch updated list after registration
    } catch (err) {
      console.log(err);
      alert(`Transaction failed: ${err}`);
    }
  }

  async function removeStudent() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      const transaction = await contract.removeStudent(studentId);
      await transaction.wait();
      alert(`${studentName} is now removed`);
      getAllStudents(); // Fetch updated list after removal
    } catch (err) {
      console.log(err);
      alert(`Transaction failed: ${err}`);
    }
  }

  async function getAllStudents() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    try {
      const studentIds = await contract.getAllStudents();
      const studentsData = await Promise.all(
        studentIds.map(async (id: number) => {
          const student = await contract.getStudentById(id);
          return { id, name: student };
        })
      );
      setStudents(studentsData);
    } catch (err) {
      console.log(err);
      alert(`Failed to fetch students: ${err}`);
    }
  }

  return (
    <div className="App">
      <div>
        <input
          type="text"
          placeholder="Enter student name"
          onChange={(e) => SetStudentName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter student ID"
          onChange={(e) => SetStudentId(e.target.value)}
        />
        <button onClick={registerStudent}>Register Student</button>
      </div>
      <div>
        <button onClick={removeStudent}>Remove Student</button>
      </div>

      {/* Button to get all students */}
      <div>
        <button onClick={getAllStudents}>Get All Students</button>
      </div>

      {/* Display students in cards */}
      <div className="students-cards">
        {students.map((student) => (
          <div key={student.id} className="student-card">
            <h3>Student ID: {student.id}</h3>
            <p>Student Name: {student.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
