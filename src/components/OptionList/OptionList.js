import React, { useEffect } from 'react'
import { Col, Row, notification } from 'antd'
import { Link, useNavigate } from 'react-router-dom'

import Tool from '../Home/Tool'
import SideBarOptionList from './SideBarOptionList'
import ListWindow from './ListWindow'
import { socket } from '../../socket/socket'
const OptionList = () => {
  useEffect(() => {
    socket.on('receiveFriendRequest', (data) => {
      notification.success({ message: 'New Friend Request', description: 'You have received a new friend request.' });
    });
  }, []);
  return (
    <Row>
      <Col span={1}><Tool /></Col>
      <Col span={6}><SideBarOptionList/> </Col>
      <Col span={17}><ListWindow/> </Col>
      </Row>
  )
}

export default OptionList