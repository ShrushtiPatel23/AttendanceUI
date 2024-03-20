import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast'
import { FaArrowCircleLeft, FaSortAlphaDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Records = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const token = localStorage.getItem('authtoken')
    const [input, setInput] = useState(false);
    const [status, setStatus] = useState("");
    const [editingId, setEditingId] = useState();
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const url = 'https://attendance-api-three.vercel.app'


    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        const sorted = [...attendanceRecords].sort((a, b) => {
            if (direction === 'ascending') {
                return a[key] > b[key] ? 1 : -1;
            } else {
                return a[key] < b[key] ? 1 : -1;
            }
        });
        setAttendanceRecords(sorted);
    };

    const handleDelete = async (id) => {
        
        try {
            const response = await axios.delete(`${url}/record/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": token
                }
            });
            fetchAttendanceRecords()
            toast.success('Deleted Succesfully')
        } catch (error) {
            console.error('Error fetching attendance records:', error);
        }
    };

    const handleEdit = async (id) => {
        console.log(id)
        setInput(true)
        setEditingId(id)
    }

    const handleSave = async (id) => {

        try {
            const response = await axios.put(`${url}/record/${id}`, {
                "status": status
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": token
                }
            });
            await fetchAttendanceRecords();
            toast.success('Updated Succesfully')
             setInput(false)
            setEditingId();
        } catch (error) {
            console.error('Error fetching attendance records:', error);
        }
    }

    const fetchAttendanceRecords = async () => {
        try {
            const response = await axios.get(`${url}/record/get`, {
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": token
                }
            });
            
            setAttendanceRecords(response.data.data);
        } catch (error) {
            toast.error('Error fetching attendance records:', error);
        }
    };

    const handleClick = () => {
        localStorage.removeItem('authtoken')
    }

    useEffect(() => {
        fetchAttendanceRecords();
    }, []);

    return (
        <div className="m-3 p-2">
            <nav className="navbar navbar-light bg-light">
                <Link to='/attend'><FaArrowCircleLeft color='green' size={50} /></Link>
                <form className="d-flex">
                    <Link to='/' onClick={handleClick}><button className="btn btn-success">Log Out</button></Link>
                </form>
            </nav>
            <div className="row-md-8">
                <div className="card">
                    <div className="card-body row justify-content-center">
                        <div className='container' style={{ height: '500px', overflowY: 'auto' }}>
                            <h2 className='text-center mb-4'>Attendance Records</h2>
                            <table className='table m-2'>
                                <thead className='justify-content-center'>
                                    <tr>
                                        <th className='text-center' >Date <span className='m-3'><FaSortAlphaDown onClick={() => handleSort('date')} /></span></th>
                                        <th className='text-center' >Status </th>
                                        <th className='text-center' >Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendanceRecords.map((record) => (
                                        <tr key={record._id}>
                                            <td className='text-center'>{new Date(record.date).toDateString()}</td>

                                            <td className='text-center'>{input && editingId === record._id ? <select className="p-2" id="dropdown" value={status} onChange={(e) => setStatus(e.target.value)}>
                                                <option value="">Select...</option>
                                                <option value="Present">Present</option>
                                                <option value="Absent">Absent</option>
                                            </select>

                                                : <button type="button" className={record.status === 'Present' ? "btn btn-success" : "btn btn-danger"}>{record.status}</button>}</td>

                                            <td className='text-center'>

                                                {input && editingId === record._id ? <button className='btn btn-outline-success m-2' onClick={() => handleSave(record._id)}>Save</button>
                                                    :
                                                    <button className='btn btn-outline-success m-2' onClick={() => handleEdit(record._id)}>Edit</button>}
                                                <button className='btn btn-outline-danger m-2' onClick={() => handleDelete(record._id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Records;
