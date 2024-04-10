import { WechatWorkOutlined } from '@ant-design/icons'
import { BiMessageSquareDetail } from "react-icons/bi";
import { PiUserListBold } from "react-icons/pi";
import { HiOutlineLogout } from "react-icons/hi";
import { IoSettingsOutline, IoClose } from "react-icons/io5";
import { IoIosInformationCircleOutline, IoMdCreate } from "react-icons/io";
import { Avatar, notification, Modal, Form, Input, Button } from 'antd';
import { Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import '../css/Tool.css';
import { socket } from '../../socket/socket';

export default function Tool() {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(''); // Thêm trạng thái cho lỗi
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [avatar, setAvatar] = useState();

  const handleLogout = () => {
    localStorage.removeItem('userToken'); // Giả định token được lưu với key là 'userToken'
    navigate('/login'); 
    // socket.disconnect(); 
  };
  const handleAvatarChange = info => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      // Sử dụng URL.createObjectURL để tạo URL tạm thời cho file được chọn
      setAvatar(URL.createObjectURL(info.file.originFileObj));
    }
  };
  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoading(true); // Đặt lại trạng thái tải mỗi khi mở modal
      try {
        const token = localStorage.getItem('userToken'); // Lấy token từ localStorage
        const userId = localStorage.getItem('userId'); // Lấy _id của người dùng từ localStorage
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const response = await axios.get(`http://localhost:5000/api/user/id/${userId}`, config); // Sử dụng _id trong yêu cầu
        setUserInfo(response.data);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        setError('Không thể tải thông tin người dùng. Vui lòng thử lại.'); // Cập nhật trạng thái lỗi
      } finally {
        setIsLoading(false); // Đảm bảo setIsLoading được cập nhật trong finally
      }
    };

    if (isPopupOpen) {
      fetchUserInfo();
    }
  }, [isPopupOpen]);

  const handleUpdateUserInfo = async (values) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('fullname', values.fullname);
      formData.append('email', values.email);
      formData.append('phoneNumber', values.phoneNumber);
      formData.append('birthday', values.birthday);

      // Chỉ thêm avatar nếu người dùng đã chọn một hình ảnh
      if (avatar) {
        formData.append('avatar', avatar);
      }

      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('userToken');
      await axios.post(`http://localhost:5000/api/user/update/${userId}`, formData, {
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      notification.success({ message: 'Thông tin đã được cập nhật thành công!' });
      setIsUpdateModalOpen(false);
    } catch (error) {
      console.error('Failed to update user info:', error);
      notification.error({ message: 'Cập nhật thông tin thất bại. Vui lòng thử lại.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tool-container">
      <Avatar size={50} style={{ border: '2px solid white' }} src={userInfo.avatar || 'path_to_default_avatar.jpg'} onClick={() => setIsPopupOpen(true)} />
      <div className='wrapper' title='Chat' >
        <BiMessageSquareDetail className="icon" style={{ fontSize: 30 ,}} onClick={() => navigate('/home')} />
      </div>
      <div className='wrapper' title='Danh sách bạn bè'>
        <PiUserListBold className="icon" style={{ fontSize: 30 }} onClick={() => navigate('/optionlist')} />

      </div>
      <div className='wrapper'>
        <IoIosInformationCircleOutline className="icon info" style={{ fontSize: 30 }} />
      </div>
      <div className='wrapper' title='Cài đặt'>
        <IoSettingsOutline className="icon" style={{ fontSize: 30 }} />
      </div>
      <div className='wrapper' title='Đăng xuất'>
        <HiOutlineLogout onClick={handleLogout} className="icon" style={{ fontSize: 30 }} />
      </div>
      {isPopupOpen && (
        <div className="popup-overlay" onClick={() => setIsPopupOpen(false)}>
          <div className="popup-content" onClick={e => e.stopPropagation()}>
            <IoClose size={20} color='black'
              style={{
                top: 0,
                left: 0,
                cursor: 'pointer',

              }}
              onClick={() => setIsPopupOpen(false)}
            />

            <h2 style={{ paddingTop: '1px' }}>Thông tin cá nhân</h2> {/* Adjust padding to accommodate avatar */}

            {isLoading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <div style={{ textAlign:'left'}}>
                {/* Background with overlay for avatar */}
                <div style={{
                  position: 'relative',
                  zIndex: 1,
                }}>
                  <div style={{
                    backgroundImage: 'url("https://source.unsplash.com/random/50")',
                    backgroundSize: 'cover',
                    borderRadius: '5px',
                    width: '100%',
                    height: '200px',
                    margin: '0 auto',
                  }}></div>
                  {/* Avatar positioned on top of the background */}
                  <Avatar size={100} src={userInfo.avatar || 'path_to_default_avatar.jpg'} style={{
                    position: 'absolute',
                    bottom: '-50px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 2,
                    border: '3px solid white',
                  }} />
                  <IoMdCreate size={24}
                    style={{
                      position: 'absolute',
                      bottom: '-75px',
                      left: 'calc(50% + 55px)',
                      zIndex: 3,
                      cursor: 'pointer',
                      color: '#76ABAE', // Example color
                    }}
                    onClick={() => setIsUpdateModalOpen(true)}
                  />
                  <Modal
                    title="Cập nhật thông tin"
                    open={isUpdateModalOpen}
                    onCancel={() => setIsUpdateModalOpen(false)}
                    footer={null}
                  >
                    <Form
                      layout="vertical"
                      onFinish={handleUpdateUserInfo}
                    >
                      {/* Các Form.Item khác */}
                      <Form.Item label="Avatar">
                        <Upload
                          name="avatar"
                          listType="picture-card"
                          className="avatar-uploader"
                          showUploadList={false}
                          beforeUpload={() => false} // Xử lý file mà không tự động tải lên
                          onChange={handleAvatarChange}
                        >
                          {avatar ? <img src={avatar} alt="avatar" style={{ width: '100%' }} /> : <div>
                            {<PlusOutlined />}
                            <div style={{ marginTop: 8 }}>Upload</div>
                          </div>}
                        </Upload>
                      </Form.Item>
                      <Form.Item label="Họ và tên" name="fullname">
                        <Input />
                      </Form.Item>
                      <Form.Item label="Email" name="email">
                        <Input />
                      </Form.Item>
                      <Form.Item label="Số điện thoại" name="phoneNumber">
                        <Input />
                      </Form.Item>
                      <Form.Item label="Ngày sinh" name="birthday">
                        <Input />
                      </Form.Item>
                     
                      <Button type="primary" htmlType="submit">
                        Cập nhật
                      </Button>
                    </Form>
                  </Modal>
                </div>

                {/* User Information */}
                <div style={{ paddingTop: '100px' }}> {/* Increase paddingTop to ensure clear separation from avatar */}
                  <p>Full Name: {userInfo.fullname}</p>
                  <p>Email: {userInfo.email}</p>
                  <p>Phone Number: {userInfo.phoneNumber}</p>
                  <p>Birthday: {userInfo.birthday}</p>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}