import { SearchOutlined, MailOutlined } from '@ant-design/icons';
import { AiOutlineUserAdd, AiOutlineUsergroupAdd } from "react-icons/ai";
import { Avatar, Input, Button, notification } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Tool.css';
export default function SideBarOptionList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!phoneNumber) return;

    setIsLoading(true);
    axios.get(`http://localhost:5000/api/user/phone/${phoneNumber}`)
      .then(response => {
        setUser(response.data);
        setIsPopupOpen(false); // Tự động đóng popup sau khi tìm thấy người dùng
      })
      .catch(error => {
        console.error('Failed to search user:', error);
        notification.error({ message: 'Lỗi tìm kiếm người dùng.' });
      })
      .finally(() => setIsLoading(false));
  }, [phoneNumber]);

  const handleSendFriendRequest = async () => {
    if (!user || !user._id) {
        notification.error({ message: 'Vui lòng chọn một người dùng hợp lệ để gửi lời mời kết bạn.' });
        return;
    }

    try {
        const senderId = localStorage.getItem('userId'); // Đảm bảo rằng giá trị này chính xác và tương ứng với ID người dùng hiện tại
        // Log ra để kiểm tra giá trị
        console.log('senderId:', senderId, 'receiverId:', user._id);

        await axios.post(`http://localhost:5000/api/friends/sendFriendRequest`, {
            sender: senderId,
            receiver: user._id
        }, {
            headers: {
                // Nếu cần, thêm header Authorization ở đây
            }
        });
        notification.success({ message: 'Lời mời kết bạn đã được gửi!' });
        setIsPopupOpen(false); // Đóng popup sau khi gửi thành công
        setUser(null); // Reset thông tin người dùng sau khi gửi lời mời
    } catch (error) {
        console.error('Failed to send friend request:', error);
        notification.error({ message: 'Không thể gửi lời mời kết bạn. Vui lòng thử lại.' });
    }
};
  return (
    <div style={{ width:'100%',height: '100vh',display:'flex',flexDirection:'column',borderRight:'1px solid #CCCCCC'}}>
      <div style={{display:'flex',width:'100%',height:64.5,borderBottom:'1px solid #CCCCCC',alignItems:'center'}}>
        <div style={{background:'#e4e8ec',marginLeft:10,display:'flex',width:270,height:30, borderRadius:10}}>
          <SearchOutlined style={{marginLeft:7,marginRight:10,fontSize:17,color:'gray'}}/>
          <input 
          style={{border:'none',outline:'none',borderRadius:10,width:400,background:'#e4e8ec'}} 
          placeholder='Tìm Kiếm'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          >
            
          </input>
        </div> 
        <div>
      <AiOutlineUserAdd style={{fontSize: 20, cursor: 'pointer'}} onClick={() => setIsPopupOpen(true)} />
      
      {isPopupOpen && (
        <div className="popup-overlay" onClick={() => setIsPopupOpen(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            
            <p>Thêm Bạn</p>
            <input 
            style={{width: 300, height: 30, borderRadius: 5, border: '1px solid #ccc', margin: '10px', padding: '5px'}}
              type="tel"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              placeholder="Số điện thoại"
            />
            {user && (
              <div style={{border:1,borderColor:'#76ABAE',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div> <p style={{fontWeight:'bold',fontSize:15}}>{user.userName}</p>
                <p>{user.phoneNumber}</p></div>
                <div> <button style={{width:100,height:30,backgroundColor:'white',borderColor:'#76ABAE',borderWidth:'3px'}}  onClick={handleSendFriendRequest}>Kết bạn</button></div>
               
               
              </div>
            )}
          
           <div>
           <button style={{}}  onClick={() => setIsPopupOpen(false)}>Đóng</button>
           </div>
          </div>
        </div>
      )}
      <AiOutlineUsergroupAdd style={{fontSize:20}}/>
    </div>
        
      </div>
      <div style={{height:'100vh',overflowY: 'scroll',overflowX:'visible',flexDirection: 'column'}}>
          <div style={{display:'flex',alignItems:'center',width:370,height:80}}>
          <MailOutlined style={{fontSize:30}}/>
            <p style={{fontSize:20,marginLeft:10}}>Lời mời kết bạn</p>
          </div>
         
          
          
      </div>
    </div>
  ) 
}