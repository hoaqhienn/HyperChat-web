import { WechatWorkOutlined } from '@ant-design/icons'
import { BiMessageSquareDetail } from "react-icons/bi";
import { PiUserListBold } from "react-icons/pi";
import { HiOutlineLogout } from "react-icons/hi";
import { IoSettingsOutline } from "react-icons/io5";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { Avatar } from 'antd';
import axios from 'axios';
import React, { useState , useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import '../css/Tool.css';

export default function Tool() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);
//   const [userInfo, setUserInfo] = useState({});
//   const [isLoading, setIsLoading] = useState(true);
  const handleLogout = () => {
    // Xóa thông tin đăng nhập từ local storage
    localStorage.removeItem('isLoggedIn');
    // Chuyển hướng người dùng đến trang đăng nhập hoặc trang chính của ứng dụng
    window.location.href = '/login'; // Thay '/login' bằng đường dẫn đến trang đăng nhập của bạn
};
// useEffect(() => {
//     const fetchUserInfo = async () => {
//       try {
//         const response = await axios.get('https://example.com/api/userinfo');
//         setUserInfo(response.data);
//         setIsLoading(false);
//       } catch (error) {
//         console.error('Failed to fetch user info:', error);
//       }
//     };

//     if (isModalOpen) {
//       fetchUserInfo();
//     }
//   }, [isModalOpen]);

  return (
    <div className="tool-container">
        <Avatar style={{width:48,height:48,border: '2px solid white'}} src={require('./image/avt.jpg')} />
        <div className='wrapper' title='Thông tin cá nhân'>
            <BiMessageSquareDetail className="icon" style={{fontSize:30}}/>
        </div>
        <div className='wrapper' title='Danh sách bạn bè'>
            <PiUserListBold className="icon" style={{fontSize:30}} onClick={()=> navigate('/optionlist')} />
            
        </div>
        <div className='wrapper'>
            <IoIosInformationCircleOutline className="icon info" style={{fontSize:30}}/>
        </div>
        <div className='wrapper' title='Cài đặt'>
            <IoSettingsOutline className="icon" style={{fontSize:30}}/>
        </div>
        <div className='wrapper' title='Đăng xuất'>
            <HiOutlineLogout onClick={handleLogout} className="icon" style={{fontSize:30}}/>
        </div>
        
    </div>
  )
}