import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './css/Onboarding.css';
import axios from 'axios';
import { verify, } from '../api/allUser'; // Assuming resendOTP is the correct endpoint for resending OTP

const Verify = () => {
    const navigate = useNavigate();
    const { state } = useLocation(); // Get email passed from the Register page
    const [otp, setOtp] = useState("");
    const [resendAvailable, setResendAvailable] = useState(false);
    const [counter, setCounter] = useState(60);

    const handleChange = (event) => {
        setOtp(event.target.value.slice(0, 6)); // Limit OTP length to 6 characters
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Check if OTP is fully entered
        if (otp.length !== 6) {
            alert("Vui lòng nhập đủ 6 số OTP.");
            return;
        }

        try {
            // Send OTP verification request to server
            const response = await axios.post(verify, {
                email: state.email, // Use email passed from the Register page
                userOTP: otp, // Send entered OTP
            });

            // If OTP is verified successfully, navigate to 'login' page
            console.log('Xác thực OTP thành công:', response.data);
            navigate('/login'); 
        } catch (error) {
            // Display error if any
            console.error('Lỗi xác thực OTP:', error.response?.data || error.message);
            alert(error.response?.data?.error || "Có lỗi xảy ra khi xác thực OTP.");
        }
    };

    useEffect(() => {
        if (counter > 0) {
            const timer = setTimeout(() => setCounter(counter - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setResendAvailable(true);
        }
    }, [counter]);

    const handleResendOTP = async () => {
        if (!resendAvailable) return;
        
        try {
            await axios.post(verify, { // Use the appropriate endpoint for resending OTP
                email: state.email,
            });

            alert("Mã OTP mới đã được gửi.");
            setResendAvailable(false);
            setCounter(60); // Restart countdown
        } catch (error) {
            console.error('Lỗi gửi lại OTP:', error.response?.data || error.message);
            alert("Có lỗi xảy ra khi gửi lại OTP.");
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: 'center', height: "100vh", backgroundColor: "#EEEEEE" }}>
            <div>
                <form onSubmit={handleSubmit}>
                    <div className="formStyle">
                        <div>
                            <h1 style={{ fontSize: 40, fontWeight: 'bolder', textAlign: "center", color: '#76ABAE' }}>Nhập OTP</h1>
                            <div>
                                <label style={{ fontSize: 25, fontWeight: 'bolder', color: '#76ABAE' }}>Mã OTP</label>
                                <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={handleChange}
                                        style={{ width: 380, height: 50, marginRight: "8px", fontSize: 25, fontWeight: 'bold', borderRadius: 5, textAlign: 'center' }}
                                    />
                                </div>
                            </div>
                            <div>
                                {resendAvailable ? (
                                    <p style={{ textAlign: 'center', marginTop: '20px', cursor: 'pointer', color: '#76ABAE' }}
                                        onClick={handleResendOTP}>Gửi lại mã OTP</p>
                                ) : (
                                    <p style={{ textAlign: 'center', marginTop: '20px' }}>Bạn có thể yêu cầu gửi lại mã sau {counter} giây.</p>
                                )}
                            </div>
                            <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', marginTop: 30 }}>
                                <button className="loginButton" type="submit">
                                    <span style={{ fontWeight: 'bold' }}>Xác nhận</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Verify;
