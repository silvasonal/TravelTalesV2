import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import TextInput from './SharedComponents/TextInput';
import SharedSnackbar from './SharedComponents/SharedSnackbar';
import { registerUser} from './services/apiService'; 
import './styles/index.css'; 

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await registerUser(username, email, password);
            setSnackbar({ open: true, message: 'Registration successful!', severity: 'success' });
            setTimeout(() => {
                navigate('/login');
            } , 1500);
        } catch (error) {
            console.error('Registration failed', error);
            setSnackbar({ open: true, message: error.response.data.error, severity: 'error' });
        }
    };

    return (
        <div className="form-container">
            <div className="form-card">
                <h2 className="text-center">Register</h2>
                <TextInput
                    id="reg_username"
                    label="Username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    required={true}
                />
                <TextInput
                    id="reg_email"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    required={true}
                />
                <TextInput
                    id="reg_password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required={true}
                />
                <button id='reg_btn' className="form-button" onClick={handleRegister}>Register</button>

                <div className="text-center">
                    <p className="mb-0">
                        Already have an account? <a href="/login" className="text-decoration-none">Sign in</a>
                    </p>
                </div>
            </div>
            <SharedSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
        </div>      
    );
};

export default Register;