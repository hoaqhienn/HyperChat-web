import React from 'react'
import { Col, Row } from 'antd'
import { Link, useNavigate } from 'react-router-dom'

import Tool from '../Home/Tool'
import SideBarOptionList from './SideBarOptionList'
import ListWindow from './ListWindow'
const OptionList = () => {
  return (
    <Row>
      <Col span={1}><Tool /></Col>
      <Col span={6}><SideBarOptionList/> </Col>
      <Col span={17}><ListWindow/> </Col>
      </Row>
  )
}

export default OptionList