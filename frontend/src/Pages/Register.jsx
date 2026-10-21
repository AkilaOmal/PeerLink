import { Link } from "react-router-dom"
import React from "react";
import {useState} from "react";
import axios from "axios";
import SignupIllustration from '../assets/signup-illustration.svg'
import './Register.css'
 
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
        <main className="register-page">
            <section className="register-card">
                <header className="register-header">
                    <Link className="register-brand" to="/">PeerLink</Link>
                    <Link className="register-login-link" to="/login">Log in</Link>
                </header>
                <div className="register-content">
                    <aside className="register-art-panel" aria-label="Join the PeerLink community">
                        <img src={SignupIllustration} alt="Hands using a phone with a learning app" />
                    </aside>
                    <div className="register-form-panel">
                        <h1>Sign up</h1>
                        <p className="register-intro">Let&apos;s get you set up to access your personal account.</p>
                        <form className="register-form">
                            <div className="form-group">
                                <label htmlFor="firstName">FirstName:</label>
                                <input type="text" id="firstName" name="firstName" onChange={onInputChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">LastName:</label>
                                <input type="text" id="lastName" name="lastName" required onChange={onInputChange} />
                            </div>
                            <div className="form-group register-full-width">
                                <label htmlFor="email">Email:</label>
                                <input type="email" id="email" name="email" required onChange={onInputChange}   />
                            </div>
                            <div className="form-group register-full-width">
                                <label htmlFor="password">Password:</label>
                                <input type="password" id="password" name="password" required onChange={onInputChange} />
                            </div>
                            <button className="register-submit" type="submit" onClick={onSubmit}>
                                Create account
                            </button>
                        </form>
                        <p className="register-login-prompt">Already have an account? <Link to="/login">Log in</Link></p>
                    </div>
                </div>
            </section>
        </main>
    )
}   
export default Register
