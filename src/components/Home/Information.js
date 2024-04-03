import { Avatar } from 'antd'
import React from 'react'
import { CiEdit } from "react-icons/ci";
import { FaRegBell } from "react-icons/fa";
import { AiOutlineUsergroupAdd } from 'react-icons/ai'

export default function Information() {
  return (
    <div >
      <div style={{width:384,height:60,borderBottom:'1px solid #CCCCCC',display:'flex',justifyContent:'center',alignItems:'center'}}>
        <h3>Thông Tin Hội Thoại</h3>
      </div>
      <div style={{width:384,height:635,display:'flex',flexDirection:'column',alignItems:'center',overflowY: 'scroll',overflowX:'visible'}}>
        <Avatar style={{marginTop:20,width:60,height:60,border: '2px solid white'}} src={require('./image/avt.jpg')} />
        <div style={{marginTop:10,display:'flex',flexDirection:'row' }}>
          <h3 style={{marginTop:4,marginLeft:30}}>Thịnh Nè</h3>
          <div style={{background:'silver',marginLeft:5,width:30,height:30,borderRadius:20,alignItems:'center',justifyContent:'center',display:'flex'}}>
          <CiEdit style={{fontSize:17}}/>
          </div>
        </div>
        <div style={{marginTop:10,display:'flex',width:200,alignItems:'center',justifyContent:'space-around',flexDirection:'row'}}>
          <div style={{backgroundColor:'silver',borderRadius:50,width:40,height:40,alignItems:'center',justifyContent:'center',display:'flex'}}>
            <FaRegBell style={{fontSize:25}}/></div>
          <div style={{backgroundColor:'silver',borderRadius:50,width:40,height:40,alignItems:'center',justifyContent:'center',display:'flex'}}>
            <AiOutlineUsergroupAdd style={{fontSize:25}}/></div>
        </div>
        <div style={{width:350,marginTop:20}}>
          <h3>Hình Ảnh</h3>
        </div>

        <div style={{width:375,marginTop:20,display:'flex',flexDirection:'row',overflowY: 'visible',overflowX:'scroll'}}>

          <img src={require('./image/avt.jpg')} style={{marginRight:10,width:120,height:120}}/>
          <img src={require('./image/avt.jpg')} style={{marginRight:10,width:120,height:120}}/>
          <img src={require('./image/avt.jpg')} style={{marginRight:10,width:120,height:120}}/>
          <img src={require('./image/avt.jpg')} style={{marginRight:10,width:120,height:120}}/>
          <img src={require('./image/avt.jpg')} style={{marginRight:10,width:120,height:120}}/>
          <img src={require('./image/avt.jpg')} style={{marginRight:10,width:120,height:120}}/>
          </div>
          <div style={{width:350,marginTop:20}}>
          <h3>File</h3>
        </div>
      </div>
    </div>
  )
}