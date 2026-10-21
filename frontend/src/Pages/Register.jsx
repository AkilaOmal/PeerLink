import { Link } from "react-router-dom"
import React from "react";
import {useState} from "react";
import axios from "axios";
 
function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    


    const {firstName, lastName, email, password} = formData;
    const onInputChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if(formData.firstName === '' || formData.lastName === '' || formData.email === '' || formData.password === '') {
        alert('Please fill in all fields');
        return;
        }

        try {
            await axios.post('http://localhost:8080/api/user', formData);
            alert('Registration successful!');
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: ''
            });
        } catch (error) {
            console.error('Error registering user:', error);
            alert('Registration failed. Please try again.');    
        }
    };

    

    

    return (
        <>
        <div>
            <h1>Register Page</h1>
            <Link to="/">Home</Link><br />
        </div>
        <div>
            <h1>Register Form</h1> 
     
            <form>
                <div className="form-group">
                    <label htmlFor="firstName">FirstName:</label>
                    <input type="text" id="firstName" name="firstName" onChange={onInputChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">LastName:</label>
                    <input type="text" id="lastName" name="lastName" required onChange={onInputChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required onChange={onInputChange}   />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required onChange={onInputChange} />
                </div>
                <button type="submit" onClick={onSubmit}>
                    Register
                </button>
            </form>
        </div>
        </>  
    )
}   
export default Register
