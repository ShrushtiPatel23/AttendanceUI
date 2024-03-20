import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'

export default function Login() {
    const url = 'https://attendance-api-three.vercel.app' 
    const [user,setUser] = useState({email: "", password: ""})
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log({user});
        await axios.post(`${url}/users/login`, user)
          .then((response) => {
            
            if(response.status === 201){
                toast.error(response.data.message)
            }
            if(response.status === 200){
                localStorage.setItem('authtoken', response.data.authtoken);
                toast.success(response.data.message)
                navigate('/attend')
            }
          }, (error) => {
            console.log(error);
            toast.error(error.message)
          });
    };

    const onChange = (e) => {
        setUser({...user, [e.target.name]: e.target.value})
    }
    return (
        <div className="container mt-5 p-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4" style={{color: 'green', fontWeight: 'bold'}}>Hello User</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label" >Email address</label>
                                    <input type="email" className="form-control" id="email" name="email" placeholder="Enter email" value={user.email} onChange={onChange} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input type="password" className="form-control" id="password" name="password" placeholder="Password" value={user.password} onChange={onChange} required />
                                </div>
                                <div className="text-center">
                                <button type="submit" className="btn btn-outline-primary">Login</button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
