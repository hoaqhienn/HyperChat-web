import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [birthday, setBirthday] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // State for the confirm password
  const [fullname, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const togglePasswordVisibility = () => setPasswordShown(!passwordShown);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match."); // Set error if passwords don't match
      return; // Prevent form submission
    }

    const userData = { userName, password, fullname, email, phoneNumber, birthday };

    try {
      const response = await axios.post('http://localhost:5000/api/user/register/send-otp', userData);
      console.log('Registration successful:', response.data);
      navigate('/verify', { state: { email: email } });
    } catch (error) {
      setError(error.response?.data.error || "An unexpected error occurred."); // Set error message from response
    }
  };

  return (
    <div className="diagonalBackground">
      <div>
        <div className={`formRegiserStyle ${isFocused ? 'shadow' : ''}`}>
          <form onSubmit={handleSubmit} >
          <h1 style={{ fontSize: 40, fontWeight: 'bolder', textAlign: 'center',color:'#76ABAE' }}>Đăng ký tài khoản</h1>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            {/* Map through each input field */}
            {[
              { label: 'Tài khoản', type: 'text', value: userName, setValue: setUserName },
              { label: 'Họ tên', type: 'text', value: fullname, setValue: setFullName },
              { label: 'Email', type: 'email', value: email, setValue: setEmail },
              { label: 'Số điện thoại', type: 'tel', value: phoneNumber, setValue: setPhoneNumber },
              { label: 'Ngày sinh', type: 'date', value: birthday, setValue: setBirthday, id: 'birthday' },
              { label: 'Mật khẩu', type: passwordShown ? 'text' : 'password', value: password, setValue: setPassword, isPassword: true },
              // Add the confirm password input
              { label: 'Nhập lại mật khẩu', type: passwordShown ? 'text' : 'password', value: confirmPassword, setValue: setConfirmPassword, isPassword: true },
            ].map((input, index) => (
              <div key={index} style={{ marginTop: index ? 20 : 0 }}>
                <label>{input.label}</label>
                <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', position: 'relative' }}>
                  <input
                    id={input.id}
                    value={input.value}
                    onChange={(e) => input.setValue(e.target.value)}
                    required
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    style={{ width: 380, outline: 'none', border: 'none', borderBottom: '1px solid #ccc' }}
                    type={input.type}
                  />
                  {input.isPassword && (
                    <FontAwesomeIcon
                      icon={passwordShown ? faEyeSlash : faEye}
                      onClick={togglePasswordVisibility}
                      style={{ position: 'absolute', right: 10, cursor: 'pointer',color:'#76ABAE' }}
                    />
                  )}
                </div>
              </div>
            ))}
            <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', marginTop: 30 }}>
              <button className="loginButton" type="submit">
                <span style={{ fontWeight: 'bold' }}>Tạo tài khoản</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
