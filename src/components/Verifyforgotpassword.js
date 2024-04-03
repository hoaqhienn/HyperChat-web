import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Verifyforgotpassword = () => {
    const navigate = useNavigate();
    const [isFocused, setIsFocused] = useState(false);
    const { state } = useLocation(); // Lấy email được truyền qua từ trang forgotpassword thông qua state
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [passwordShown, setPasswordShown] = useState(false);
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const togglePasswordVisiblity = () => {
        setPasswordShown(!passwordShown);
    };
    const handleChange = (event) => {
        setOtp(event.target.value.slice(0, 6)); // Giới hạn độ dài của OTP nhập vào là 6 ký tự
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Kiểm tra xem OTP đã được điền đầy đủ 6 ký tự chưa
        if (otp.length !== 6) {
            alert("Vui lòng nhập đủ 6 số OTP.");
            return;
        }
        if(password.length == ""){
            alert("Bắt Buộc Nhập");
            return;
        }

        try {
            // Gửi yêu cầu xác thực OTP tới server
            const response = await axios.put('http://localhost:5000/api/user/verifyOTPForgotPassword', {
                email: state.email, // Sử dụng email được truyền qua từ trang Forgotpassword
                userOTP: otp, // Gửi OTP nhập vào
                password: password //password mới
            });

            // Nếu xác thực thành công, chuyển hướng người dùng đến trang 'login'
            console.log('Xác thực OTP thành công:', response.data);
            navigate('/login'); 
        } catch (error) {
            // Hiển thị lỗi nếu có
            console.error('Lỗi xác thực OTP:', error.response?.data || error.message);
            alert(error.response?.data?.error || "Có lỗi xảy ra khi xác thực OTP.");
            console.log(otp,state.email)
        }
    };

    return (
        <div className="diagonalBackground">
            <div>
                <div style={{ position: 'relative' }}>
                    <h5 style={{ fontSize: 40, fontWeight: 'bolder', textAlign: "center" }}>OTP và password mới</h5>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="formStyle">
                      <div>
                        <div style={{marginBottom:30}}>
                            <label style={{fontSize:25,fontWeight:'bolder'}}>Mã Otp</label>
                            <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', }}>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={handleChange}
                                    style={{ width: 380, height: 50, marginRight: "8px", fontSize: 25, fontWeight: 'bold', borderRadius: 5,textAlign:'center' }}
                                />
                            </div>
                        </div>
                        <div style={{width: 380, height: 50, marginRight: "8px", fontWeight: 'bold', borderRadius: 5 }}>
                            <label style={{fontSize:25,fontWeight:'bolder'}}>Mật khẩu mới</label>
                            <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', position: 'relative' }}>
                                <input
                                    value={password}
                                    onChange={(e)=>setPassword(e.target.value)}
                                    onFocus={handleFocus} onBlur={handleBlur}
                                    style={{ width: 380, height: 50, marginRight: "8px", fontSize: 25, fontWeight: 'bold', borderRadius: 5}}
                                    type={passwordShown ? 'text' : 'password'} placeholder='password reset'
                                />
                                <FontAwesomeIcon
                                            icon={passwordShown ? faEyeSlash : faEye}
                                            onClick={togglePasswordVisiblity}
                                            style={{ position: 'absolute', right: 10, cursor: 'pointer',color:'#76ABAE' }}
                                        />
                            </div>
                        </div>
                        <div style={{justifyContent: 'center', alignItems: 'center', display: 'flex', marginTop: 30 }}>
                            <button className="loginButton" style={{marginTop:40}} type="submit">
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

export default Verifyforgotpassword;