import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import abi from '../abi.json';
import './App.css';

function App() {
  const [account, setAccount] = useState('');
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const contractAddress = '0x6f036bC00aeFE453f38316d55adAD0C54a2A91dB';

  useEffect(() => {
    loadStudents();
  }, []);

  const getContract = async () => {
    if (!window.ethereum) {
      setMessage('Metamask is required.');
      return null;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(contractAddress, abi, signer);
  };

  const loadStudents = async () => {
    setLoading(true);
    try {
      const contract = await getContract();
      if (!contract) return;
      const studentList = await contract.getStudents();
      setStudents(studentList);
    } catch (error) {
      setMessage(`Error loading students: ${error.message}`);
    }
    setLoading(false);
  };

  const registerStudent = async () => {
    setLoading(true);
    setMessage('');
    try {
      const contract = await getContract();
      if (!contract) return;
      const tx = await contract.registerStudent(studentId, studentName);
      await tx.wait();
      setMessage('Student registered successfully!');
      setStudentId('');
      setStudentName('');
      loadStudents();
    } catch (error) {
      setMessage(`Error registering student: ${error.message}`);
    }
    setLoading(false);
  };

  const removeStudent = async (id) => {
    setLoading(true);
    setMessage('');
    try {
      const contract = await getContract();
      if (!contract) return;
      const tx = await contract.removeStudent(id);
      await tx.wait();
      setMessage('Student removed successfully!');
      loadStudents();
    } catch (error) {
      setMessage(`Error removing student: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>School Management System</h1>
        {message && <div className="message-box">{message}</div>}
      </header>
      <main className="app-main">
        <section className="registration-form">
          <h2>Register a Student</h2>
          <input type="text" placeholder="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
          <input type="text" placeholder="Student Name" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
          <button onClick={registerStudent} disabled={loading || !studentId || !studentName}>
            {loading ? 'Registering...' : 'Register Student'}
          </button>
        </section>
        <section className="student-list">
          <h2>Registered Students</h2>
          {students.length === 0 ? (
            <p>No students registered.</p>
          ) : (
            students.map((student, index) => (
              <div key={index} className="student-item">
                <h3>{student.name} (ID: {student.id})</h3>
                <button onClick={() => removeStudent(student.id)} disabled={loading}>Remove</button>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
