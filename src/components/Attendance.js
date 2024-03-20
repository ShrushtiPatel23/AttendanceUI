import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
export default function Attendance() {

  const [selectedDates, setSelectedDates] = useState([])
  const token = localStorage.getItem('authtoken')
  const [status, setStatus] = useState("")
  const [statusData, setStatusData] = useState({});
  const url = 'https://attendance-api-three.vercel.app' 
 
  const handleDateChange = async (date) => {

    const index = selectedDates.findIndex((d) => d.toDateString() === date.toDateString());

    if (index === -1) {
      const isoDate = new Date(date).toISOString();
      console.log(isoDate)
      await axios.post(`${url}/record/data`, {
        "date": isoDate,
        "status": status
      },
        {
          headers: {
            'Content-Type': 'application/json',
            "auth-token": token
          }
        },

      )
        .then((response) => {
          if (response.status === 200) {
            setSelectedDates([...selectedDates, date]);
            toast.success(response.data.message)
          }
          if (response.status === 201) {
            toast.success(response.data)
          }
        }, (error) => {
          toast.error(error.message)
        });

    } else {
      setSelectedDates(selectedDates.filter((d) => d.toDateString() !== date.toDateString()));
      setStatus("Absent")
    }
  }

  const tileContent = ({ date }) => {
    setStatus("Present")

    const status = statusData[new Date(date).toDateString()];

    if (status === 'Present') {
      return <div style={{ backgroundColor: 'green', borderRadius: '50%', width: '20px', height: '20px' }}></div>
    }

    if (status === 'Absent') {
      return <div style={{ backgroundColor: 'red', borderRadius: '50%', width: '20px', height: '20px' }}></div>
    }

    if (selectedDates.find((d) => d.toDateString() === date.toDateString())) {
      return <div style={{ backgroundColor: 'green', borderRadius: '50%', width: '20px', height: '20px' }}></div>;
    }
    return null;
  };

  const handleClick = () => {
    localStorage.removeItem('authtoken')
  }

  const fetchAttendanceRecords = async () => {
    try {
      const response = await axios.get(`${url}/record/get`, {
        headers: {
          'Content-Type': 'application/json',
          "auth-token": token
        }
      });
      console.log(response.data.formatDate)
      setStatusData(response.data.formatDate);
     
    } catch (error) {
      console.error('Error fetching attendance records:', error);
    }
  };
 
  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  return (
    <div className="m-2 p-2">
      <nav className="navbar navbar-light bg-light">
        <a className="navbar-brand"><FaUser color='green' size={50} /></a>
        <form className="d-flex">
          <Link to='/' onClick={handleClick}><button className="btn btn-success">Log Out</button></Link>
        </form>
      </nav>
      <div className="row mt-2">
        <div className="card" style={{ height: '600px' }}>
          <div className="card-body row justify-content-center">
            <h2 className=" card-title text-center mb-2">Attendance Calendar</h2>
            <Calendar
              onChange={handleDateChange}
              value={selectedDates}
              tileContent={tileContent}
              tileDisabled={tileContent}
            />
            <div className='d-flex justify-content-center'>
              <div className='mt-2 m-2' style={{ backgroundColor: 'green', borderRadius: '50%', width: '20px', height: '20px', padding: '10px' }}></div>
              <p className='mt-2'>Present</p>
              <div className='mt-2 m-2' style={{ backgroundColor: 'red', borderRadius: '50%', width: '20px', height: '20px', padding: '10px' }}></div>
              <p className='mt-2'>Absent</p>
            </div>
          </div>
          <div className='p-2 m-2 text-center' >
            <Link to='/allRecord'><button className='btn btn-primary'>Show Attendance Record</button></Link>
          </div>
        </div>

      </div>
    </div>

  );
};

