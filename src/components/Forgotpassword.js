import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Forgotpassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const userData = { email };

        try {
            const response = await axios.post('http://localhost:5000/api/user/sendOTPForgotPassword', userData);
            console.log('OTP sent successfully:', response.data);
            // Chuyển hướng người dùng đến trang xác minh mã OTP, truyền dữ liệu người dùng qua state
            navigate('/verifyforgotpassword', { state: { email: email } });
        } catch (error) {
            setError(error.response?.data.error || "An unexpected error occurred.");
            console.log(userData)
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: 'center', height: "100vh", backgroundColor: "#EEEEEE" }}>
            <div>
                <form>
                    <div className="formStyle">
                        <div>
                            <h1 style={{ marginTop: -100, marginBottom: 40, fontSize: 40, fontWeight: 'bolder', textAlign: "center", color: '#76ABAE' }}>Lấy lại mật khẩu</h1>
                            {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{error}</div>}
                            <div style={{ marginBottom: 40 }}>
                                <div>
                                    <label style={{ color: '#76ABAE' }}>Vui lòng nhập email của bạn</label>
                                    <div style={{ marginTop: 20 }}>
                                        <input
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            style={{ width: 380, outline: 'none', border: 'none', borderBottom: '1px solid #ccc' }}
                                            type='text'
                                            placeholder='Email'
                                        />
                                    </div>
                                </div>
                            </div>
                            <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }} >
                                <button onClick={handleSubmit} type="submit" className="loginButton">
                                    <span style={{ fontWeight: 'bold' }}>Đặt lại mật khẩu</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Forgotpassword;