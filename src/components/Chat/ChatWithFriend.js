import React, { useEffect, useState } from 'react'
import { Col, Row } from 'antd'
import { Link, useNavigate } from 'react-router-dom'

import Tool from '../Home/Tool'
import SideBar from '../Home/SideBar'
import ChatWindow from '../Home/ChatWindow'
import Information from '../Home/Information'
import { useSelector, useDispatch } from 'react-redux';
import { socket } from '../../socket/socket';
import { useParams } from 'react-router-dom';
const ChatWithFriend = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [onlineUsers, setOnlineUsers] = useState([]);
  let { friendId } = useParams();
  // useEffect(() => {
  //   // console.log("user._id",user._id);
  //   socket.emit('userOnline',user._id);
  //   socket.emit('listOnlineUsers');
  //   // Lắng nghe sự kiện 'onlineUsers' từ máy chủ và cập nhật trạng thái của danh sách người dùng trực tuyến
  //   socket.on('onlineUsers', (users) => {
  //     setOnlineUsers(users);
  //   });
    
  // }, []);
  
  return (
    <Row>
      <Col span={1}><Tool /></Col>
      <Col span={6}><SideBar/> </Col>
      <Col span={17}><ChatWindow/> </Col>
      
      </Row>
  )
}

export default ChatWithFriend