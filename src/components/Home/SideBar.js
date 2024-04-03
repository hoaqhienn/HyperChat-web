import { SearchOutlined } from '@ant-design/icons'
import { AiOutlineUserAdd, AiOutlineUsergroupAdd } from "react-icons/ai";
import { Avatar } from 'antd'
import React from 'react'

export default function SideBar() {
  return (
    <div style={{height: '100vh',display:'flex',flexDirection:'column',borderRight:'1px solid #CCCCCC'}}>
      <div style={{display:'flex',width:384,height:64.5,borderBottom:'1px solid #CCCCCC',alignItems:'center'}}>
        <div style={{background:'#e4e8ec',marginLeft:10,display:'flex',width:270,height:30, borderRadius:10}}>
          <SearchOutlined style={{marginLeft:7,marginRight:10,fontSize:17,color:'gray'}}/>
          <input style={{border:'none',outline:'none',borderRadius:10,width:400,background:'#e4e8ec'}} placeholder='Tìm Kiếm'></input>
        </div> 
        <AiOutlineUserAdd style={{marginLeft:20,marginRight:20,fontSize:20}}/>
        <AiOutlineUsergroupAdd style={{fontSize:20}}/>
      </div>
      <div style={{height:'100vh',overflowY: 'scroll',overflowX:'visible',flexDirection: 'column'}}>
          <div style={{display:'flex',alignItems:'center',width:370,height:80}}>
            <Avatar style={{marginLeft:10,width:60,height:60,border: '2px solid white'}} src={require('./image/avt.jpg')} />
            <div style={{width:280,height:60,marginLeft:10,display:'flex',flexDirection:'column'}}>
              <p style={{fontFamily:'Arial',fontSize:15,marginBottom:5,marginTop:5,fontWeight:600}}>Thịnh Nè</p>
              <p style={{fontFamily:'Arial',fontSize:13,fontWeight:500}}>Bạn: Hello</p>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',width:370,height:80}}>
            <Avatar style={{marginLeft:10,width:60,height:60,border: '2px solid white'}} src={require('./image/avt.jpg')} />
            <div style={{width:280,height:60,marginLeft:10,display:'flex',flexDirection:'column'}}>
              <p style={{fontFamily:'Arial',fontSize:15,marginBottom:5,marginTop:5,fontWeight:600}}>Thịnh Nè</p>
              <p style={{fontFamily:'Arial',fontSize:13,fontWeight:500}}>Bạn: Hello</p>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',width:370,height:80}}>
            <Avatar style={{marginLeft:10,width:60,height:60,border: '2px solid white'}} src={require('./image/avt.jpg')} />
            <div style={{width:280,height:60,marginLeft:10,display:'flex',flexDirection:'column'}}>
              <p style={{fontFamily:'Arial',fontSize:15,marginBottom:5,marginTop:5,fontWeight:600}}>Thịnh Nè</p>
              <p style={{fontFamily:'Arial',fontSize:13,fontWeight:500}}>Bạn: Hello</p>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',width:370,height:80}}>
            <Avatar style={{marginLeft:10,width:60,height:60,border: '2px solid white'}} src={require('./image/avt.jpg')} />
            <div style={{width:280,height:60,marginLeft:10,display:'flex',flexDirection:'column'}}>
              <p style={{fontFamily:'Arial',fontSize:15,marginBottom:5,marginTop:5,fontWeight:600}}>Thịnh Nè</p>
              <p style={{fontFamily:'Arial',fontSize:13,fontWeight:500}}>Bạn: Hello</p>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',width:370,height:80}}>
            <Avatar style={{marginLeft:10,width:60,height:60,border: '2px solid white'}} src={require('./image/avt.jpg')} />
            <div style={{width:280,height:60,marginLeft:10,display:'flex',flexDirection:'column'}}>
              <p style={{fontFamily:'Arial',fontSize:15,marginBottom:5,marginTop:5,fontWeight:600}}>Thịnh Nè</p>
              <p style={{fontFamily:'Arial',fontSize:13,fontWeight:500}}>Bạn: Hello</p>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',width:370,height:80}}>
            <Avatar style={{marginLeft:10,width:60,height:60,border: '2px solid white'}} src={require('./image/avt.jpg')} />
            <div style={{width:280,height:60,marginLeft:10,display:'flex',flexDirection:'column'}}>
              <p style={{fontFamily:'Arial',fontSize:15,marginBottom:5,marginTop:5,fontWeight:600}}>Thịnh Nè</p>
              <p style={{fontFamily:'Arial',fontSize:13,fontWeight:500}}>Bạn: Hello</p>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',width:370,height:80}}>
            <Avatar style={{marginLeft:10,width:60,height:60,border: '2px solid white'}} src={require('./image/avt.jpg')} />
            <div style={{width:280,height:60,marginLeft:10,display:'flex',flexDirection:'column'}}>
              <p style={{fontFamily:'Arial',fontSize:15,marginBottom:5,marginTop:5,fontWeight:600}}>Thịnh Nè</p>
              <p style={{fontFamily:'Arial',fontSize:13,fontWeight:500}}>Bạn: Hello</p>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',width:370,height:80}}>
            <Avatar style={{marginLeft:10,width:60,height:60,border: '2px solid white'}} src={require('./image/avt.jpg')} />
            <div style={{width:280,height:60,marginLeft:10,display:'flex',flexDirection:'column'}}>
              <p style={{fontFamily:'Arial',fontSize:15,marginBottom:5,marginTop:5,fontWeight:600}}>Thịnh Nè</p>
              <p style={{fontFamily:'Arial',fontSize:13,fontWeight:500}}>Bạn: Hello</p>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',width:370,height:80}}>
            <Avatar style={{marginLeft:10,width:60,height:60,border: '2px solid white'}} src={require('./image/avt.jpg')} />
            <div style={{width:280,height:60,marginLeft:10,display:'flex',flexDirection:'column'}}>
              <p style={{fontFamily:'Arial',fontSize:15,marginBottom:5,marginTop:5,fontWeight:600}}>Thịnh Nè</p>
              <p style={{fontFamily:'Arial',fontSize:13,fontWeight:500}}>Bạn: Hello</p>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',width:370,height:80}}>
            <Avatar style={{marginLeft:10,width:60,height:60,border: '2px solid white'}} src={require('./image/avt.jpg')} />
            <div style={{width:280,height:60,marginLeft:10,display:'flex',flexDirection:'column'}}>
              <p style={{fontFamily:'Arial',fontSize:15,marginBottom:5,marginTop:5,fontWeight:600}}>Thịnh Nè</p>
              <p style={{fontFamily:'Arial',fontSize:13,fontWeight:500}}>Bạn: Hello</p>
            </div>
          </div>
          
          
      </div>
    </div>
  ) 
}