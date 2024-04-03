import { SearchOutlined, UsergroupAddOutlined } from '@ant-design/icons'
import { Avatar } from 'antd'
import React from 'react'
import { AiOutlineUsergroupAdd } from 'react-icons/ai'
import { FiVideo } from "react-icons/fi";
import { PiListDashesBold } from "react-icons/pi";
import { AiTwotoneLike } from "react-icons/ai";
import { IoSend } from "react-icons/io5";
import { LuSticker } from "react-icons/lu";
import { LuImage } from "react-icons/lu";
import { LuSmile } from "react-icons/lu";
import { LuFile } from "react-icons/lu";






export default function ChatWindow() {
  return (
    <div style={{background:'white',height: '100vh',borderRight:'1px solid #CCCCCC'}}>
      <div style={{width:703,height:60,borderBottom:'1px solid #CCCCCC',display:'flex',alignItems:'center'}}>
        <Avatar style={{marginLeft:10,width:50,height:50,border: '2px solid white'}} src={require('./image/avt.jpg')} />
        <div style={{marginLeft:20,width:300, height:50,display:'flex',flexDirection:'column'}}>
          <p style={{marginTop:3,marginBottom:4,fontFamily:'Arial',fontWeight:700}}>Thịnh Nè</p>
          <p style={{color:'green',fontWeight:'bold'}}>Active</p>
        </div>
        <AiOutlineUsergroupAdd style={{marginLeft:155,fontSize:25}} />
        <SearchOutlined style={{marginLeft:15,fontSize:25}} />
        <FiVideo style={{marginLeft:15,fontSize:25}} />
        <PiListDashesBold style={{marginLeft:15,fontSize:25}} />
      </div>
      <div style={{widows:703,height:535,background:'white',borderBottom:'1px solid #CCCCCC'}}></div>
      <div style={{width:703,height:100}}>
        <div style={{width:703,height:45,borderBottom:'1px solid #CCCCCC',display:'flex',alignItems:'center'}}>
        <LuSticker style={{marginLeft:25,fontSize:25}} />
        <LuSmile style={{marginLeft:25,fontSize:25}} />
        <LuImage style={{marginLeft:25,fontSize:25}} />
        <LuFile style={{marginLeft:25,fontSize:25}} />
        </div>
        <div style={{widows:703,height:55,display:'flex',alignItems:'center'}}>
          <input style={{border:'none',outline:'none',marginLeft:15,width:450,height:25,fontSize:15}} placeholder='Nhập Tin Nhắn'></input>
          <IoSend style={{marginLeft:140,fontSize:25,color:'green'}} />
          <AiTwotoneLike style={{marginLeft:25,fontSize:25,color:'green'}} />
        </div>
      </div>
    </div>
  )
}