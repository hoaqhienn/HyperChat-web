import { Col, Row } from 'antd'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SideBar from './SideBar'
import ChatWindow from './ChatWindow'
import Tool from './Tool'
import Information  from './Information'
const Home = () => {
  return (
    <Row>
      <Col span={1}><Tool /></Col>
      <Col span={6}><SideBar/> </Col>
      <Col span={11}><ChatWindow/> </Col>
      <Col span={6}><Information /></Col>
    </Row>
  )
}

export default Home