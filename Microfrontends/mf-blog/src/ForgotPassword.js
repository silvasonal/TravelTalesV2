import { useState } from 'react';   
import { useNavigate } from 'react-router-dom';
import TextInput from './SharedComponents/TextInput';
import { resetPassword } from './services/apiService';
import SharedSnackbar from './SharedComponents/SharedSnackbar';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const navigate = useNavigate();


    const handleResetPassword = async () => {
        try{
            const response = await resetPassword(email, newPassword);
            setSnackbar({ open: true, message: 'Password reset successful!', severity: 'success' });
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        }catch (error) {
            console.error('Password reset failed', error);
            setSnackbar({ open: true, message: error.response.data.error, severity: 'error' });
        }
    }

    return(
        <div className="form-container">
            <div className="form-card">
                <h2 className="text-center">Reset Password</h2>

                 <TextInput
                    id="log_email"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    required={true}
                />

                <TextInput
                    id="reset_password"
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter password"
                    required={true}
                />
              
                <button id='reset_password_btn' className="form-button" onClick = {handleResetPassword} >Reset Password</button>
            </div>
            
            <SharedSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
        </div>
    )
}

export default ForgotPassword;