import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { loginUserSuccess } from '../redux/authSlice';
import axios from 'axios';
import { login } from '../api/allUser';
const Login = () => {
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const [account, setAccount] = useState('Thinh@admin123');
    const [password, setPassword] = useState('Thinh@admin123');
    const [passwordShown, setPasswordShown] = useState(false);

    const [error, setError] = useState(''); // State to store the error message

    const togglePasswordVisiblity = () => {
        setPasswordShown(!passwordShown);
    };
    // Tạo một instance Axios với cấu hình mặc định
    const axiosInstance = axios.create({
        baseURL: login,
    });

    // Sử dụng Axios Interceptors để thêm token vào headers của mỗi request
    axiosInstance.interceptors.request.use(config => {
        const token = localStorage.getItem('userToken');
        config.headers.Authorization = token ? `${token}` : '';
        return config;
    });

    // Sau này, bạn có thể sử dụng axiosInstance thay vì axios


    const handleLogin = async (event) => {
        event.preventDefault(); // Prevent form submission
        setError(''); // Clear previous error messages
        //192.168.2.40
        //192.168.1.6
        try {
            const response = await axios.post(login, {
                account: account,
                password: password,
            });
            localStorage.setItem('userToken', response.data.token); // Lưu token
            localStorage.setItem('userId', response.data._id);
            console.log('Login successful:', response.data);

            dispatch(loginUserSuccess(response.data)); // Dispatch the login success action

            navigate('/home'); // Redirect to home page on successful login
        } catch (error) {
            console.error('Login failed:', error.response?.data?.message || error.message);
            setError(error.response?.data?.message || "Tài khoản hoặc mật khẩu không đúng."); // Update the error state with the error message
        }
    };
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: 'center', height: "100vh", backgroundColor: "#EEEEEE", }}>
            <div style={{}}>

                <form onSubmit={handleLogin} >
                    <div className={`formStyle ${isFocused ? 'shadow' : ''}`}>
                        <div>
                            <h1 style={{ fontSize: 40, fontWeight: 'bolder', textAlign: "center", color: '#76ABAE' }}>Login</h1>
                            {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{error}</div>}
                            <div >
                                <div>
                                    <label style={{ color: '#76ABAE' }}>Tài khoản</label>
                                    <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>

                                        <input
                                            value={account}
                                            onChange={(e) => setAccount(e.target.value)}
                                            onFocus={handleFocus} onBlur={handleBlur} style={{ width: 380, outline: 'none', border: 'none', borderBottom: '1px solid #ccc' }} type='text' placeholder='Username,Email,Số Điện Thoại'></input>
                                    </div>
                                </div>
                                <div style={{ marginTop: 20 }}>
                                    <label style={{ color: '#76ABAE' }}>Mật Khẩu</label>
                                    <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', position: 'relative' }}>
                                        <input
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onFocus={handleFocus} onBlur={handleBlur} style={{ width: 380, outline: 'none', border: 'none', borderBottom: '1px solid #ccc' }} type={passwordShown ? 'text' : 'password'} placeholder='Mật Khẩu'></input>
                                        <FontAwesomeIcon
                                            icon={passwordShown ? faEyeSlash : faEye}
                                            onClick={togglePasswordVisiblity}
                                            style={{ position: 'absolute', right: 10, cursor: 'pointer', color: '#76ABAE' }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', marginTop: 30 }}>
                                <button type="submit" className="loginButton"

                                > <span style={{ fontWeight: 'bold' }}>Đăng Nhập</span> </button>
                            </div>
                            <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', marginTop: 10 }} >
                                <a onClick={() => navigate('/forgotpassword')} style={{ color: 'black', fontWeight: 'inherit', color: '#76ABAE' }} href=''>Quên mật khẩu?</a>
                            </div>
                        </div>
                    </div>


                </form>
            </div>


        </div>
    )
}

export default Login