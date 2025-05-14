
import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const SharedSnackbar = ({ snackbar, setSnackbar }) => {
    return (
        <Snackbar
            id='snackbar'
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                {snackbar.message}
            </Alert>
        </Snackbar>
    );
};

export default SharedSnackbar;
