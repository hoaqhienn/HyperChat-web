import { Col, Row, notification } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SideBar from './SideBar'
import ChatWindow from './ChatWindow'
import Tool from './Tool'
import Information  from './Information'
import { socket } from '../../socket/socket'
import { useSelector } from 'react-redux'
const Home = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [onlineUsers, setOnlineUsers] = useState([]);
  useEffect(() => {
    // console.log("user._id",user._id);
    socket.emit('userOnline',user._id);
    socket.emit('listOnlineUsers');
    // Lắng nghe sự kiện 'onlineUsers' từ máy chủ và cập nhật trạng thái của danh sách người dùng trực tuyến
    socket.on('onlineUsers', (users) => {
      setOnlineUsers(users);
    });
    
  }, []);
  // useEffect(() => {
  //   socket.on('receiveFriendRequest', (data) => {
  //     notification.success({ message: 'New Friend Request', description: 'You have received a new friend request.' });
  //   });
  // }, []);
  return (
    <Row>
      <Col span={1}><Tool /></Col>
      <Col span={6}><SideBar/> </Col>
      {/* <Col span={12}><ChatWindow/> </Col>
      <Col span={5}><Information /></Col> */}
       <Col span={17}></Col>
    </Row>
  )
}

export default Home