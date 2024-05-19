import { SearchOutlined, MailOutlined } from '@ant-design/icons';
import { AiOutlineUserAdd, AiOutlineUserDelete, AiOutlineUsergroupAdd } from "react-icons/ai";
import { Avatar, Input, Button, notification } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import '../css/Tool.css';
import { PiUserListBold } from 'react-icons/pi';
import { createChatPrivate, getAllFriends, getAllMessagesByChatId, info, listchats, sendFriendRequest, unFriend } from '../../api/allUser';
import { useNavigate } from 'react-router-dom';
import { saveChatInfo, saveChatItem } from '../../redux/chatSlice';

import { getFriendSuccess } from '../../redux/friendSlice';
import { socket } from '../../socket/socket';

export default function SideBarOptionList() {
  const dispatch = useDispatch();
  const users = useSelector(state => state.user.users);
  const me = useSelector(state => state.auth.user);
  // State Hooks
  const [searchTerm, setSearchTerm] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [user, setUser] = useState(null);
  const [listFriend, setListFriend] = useState([]);
  const [listChat, setListChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Effect Hook để tìm kiếm người dùng dựa trên số điện thoại khi phoneNumber thay đổi
  useEffect(() => {
    if (!phoneNumber) return;
    axios.get(`${info}/${phoneNumber}`)
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error('Failed to search user:', error);
        notification.error({ message: 'Lỗi tìm kiếm người dùng.' });
      });
  }, [phoneNumber]);
  useEffect(() => getListFriend,[]);
  // Effect hook để lấy danh sách chat khi component được render
  useEffect(() => {
    const fetchFriendsList = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`${listchats}${userId}`, {
        });
        setListChat(response.data);
        dispatch(getFriendSuccess(response.data));
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching friends list:', error);
        notification.error({ message: 'Failed to fetch. Please try again.' });
      }
    };
    fetchFriendsList();
  }, []);
  // render ra màn hình tin nhắn khi nhấn vào bạn bè
  const renderChat = (member)=>{
    const compareArrays = (arr1, arr2) => {
      const sortedArr1 = arr1.slice().sort().join(',');
      const sortedArr2 = arr2.slice().sort().join(',');
      if(sortedArr1 === sortedArr2){
        return true;
      }
    }
    listChat.map((item,index)=>{
      if (compareArrays(item.members, member)) {
        console.log(item.members,member)
        dispatch(saveChatInfo(item));
        console.log("Room-info:", item);
        getChatData(item._id);
        socket.emit('joinRoom', item._id, item.members);
        navigate(`/chatwithfriend`, { state: { friendId: item._id } })
      }
    })
  }
  //render tin nhắn 
  const getChatData = async (chatId) => {
    try {
      const response = await axios.get(`${getAllMessagesByChatId}${chatId}`);
      console.log("Room-data:", response.data);
      dispatch(saveChatItem(response.data));

    } catch (error) {
      console.error('Error fetching messages for chat ID', chatId, ":", error);
    }
  }
  // Xử lý gửi lời mời kết bạn
  const handleSendFriendRequest = async () => {
    if (!user || !user._id) {
      notification.error({ message: 'Vui lòng chọn một người dùng hợp lệ để gửi lời mời kết bạn.' });
      return;
    }

    try {
      const senderId = localStorage.getItem('userId'); // Lấy ID của người dùng hiện tại từ local storage
      await axios.post(sendFriendRequest, {
        sender: senderId,
        receiver: user._id
      });
      notification.success({ message: 'Lời mời kết bạn đã được gửi!' });
      setIsPopupOpen(false); // Đóng popup sau khi gửi thành công
      setUser(null); // Reset thông tin người dùng sau khi gửi lời mời
    } catch (error) {
      console.error('Failed to send friend request:', error);
      notification.error({ message: 'Không thể gửi lời mời kết bạn. Vui lòng thử lại.' });
    }
  };
  /* Đoạn này tôi tách cái hàm lấy danh sách bạn bè ra là một hàm riêng để sài được nhiều lần
    Useeffect thì tôi sử dụng lại như thế xong tới hàm hủy kết bạn tui sau khi hủy kết bạn thành công
    tui sử dụng lại hàm getListFriend để cho nó lấy lại danh sách bạn bè mới rồi useefect nó thấy thay đổi nó sẽ 
    set lại rồi render lại danh sách mới 
  */
  // Effect hook để lấy danh sách bạn bè khi component được render
  const getListFriend = async () => {
    try {
      // Gọi API để lấy danh sách yêu cầu kết bạn
      const res = await getAllFriends(me._id);
      // Cập nhật state với danh sách yêu cầu kết bạn
      setListFriend(res);
      console.log(listFriend);
    } catch (error) {
      console.error('Error caught:', error);
    }
  };
  useEffect(() => getListFriend,[]);
  // Hủy kết bạn
  const deleteFriend = async (sender,receiver) => {
    console.log(unFriend);
    try {
      await axios.delete(unFriend, {
        data: { sender: sender, receiver: receiver }
      });
      notification.success({ message: 'Đã Hủy Kết Bạn THành Công' });
      getListFriend();
    } catch (error) {
      console.error('Failed to send friend request:', error);
      notification.error({ message: 'Hủy kết bạn thất bại' });
    }
  }
  return (
    <div style={{ width:'100%', height: '100vh', display:'flex', flexDirection:'column', borderRight:'1px solid #CCCCCC'}}>
      {/* Phần header */}
      <div style={{ display:'flex', width:'100%', height:64.5, borderBottom:'1px solid #CCCCCC', alignItems:'center'}}>
        {/* Ô tìm kiếm */}
        <div style={{ background:'#e4e8ec', marginLeft:10, display:'flex', width:270, height:30, borderRadius:10}}>
          <SearchOutlined style={{ marginLeft:7, marginRight:10, fontSize:17, color:'gray'}}/>
          <input 
            style={{ border:'none', outline:'none', borderRadius:10, width:400, background:'#e4e8ec'}} 
            placeholder='Tìm Kiếm'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div> 
        {/* Nút thêm bạn */}
        <div>
          <AiOutlineUserAdd style={{ fontSize: 20, cursor: 'pointer'}} onClick={() => setIsPopupOpen(true)} />
          {/* Hiển thị popup nếu isPopupOpen là true */}
          {isPopupOpen && (
            <div className="popup-overlay" onClick={() => setIsPopupOpen(false)}>
              <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <p>Thêm Bạn</p>
                {/* Form nhập số điện thoại */}
                <input 
                  style={{ width: 300, height: 30, borderRadius: 5, border: '1px solid #ccc', margin: '10px', padding: '5px'}}
                  type="tel"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  placeholder="Số điện thoại"
                />
                {/* Hiển thị thông tin người dùng nếu có */}
                {user && (
                  <div style={{ border:1, borderColor:'#76ABAE', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <div>
                      <p style={{ fontWeight:'bold', fontSize:15}}>{user.userName}</p>
                      <p>{user.phoneNumber}</p>
                    </div>
                    <div> 
                      <button style={{ width:100, height:30, backgroundColor:'white', borderColor:'#76ABAE', borderWidth:'3px'}} onClick={handleSendFriendRequest}>Kết bạn</button>
                    </div>
                  </div>
                )}
                {/* Nút đóng popup */}
                <div>
                  <button style={{}} onClick={() => setIsPopupOpen(false)}>Đóng</button>
                </div>
              </div>
            </div>
          )}
          <AiOutlineUsergroupAdd style={{ fontSize:20}}/>
        </div>
      </div>
      {/* Phần danh sách bạn bè */}
      <div style={{ height:'100vh', overflowY:'scroll', overflowX:'visible', flexDirection:'column'}}>
        {/* Lời mời kết bạn */}
        <div style={{ display:'flex', alignItems:'center', width:370, height:80, backgroundColor:'red'}}>
          <MailOutlined style={{ marginLeft:30, fontSize:30}}/>
          <p style={{ fontSize:20, marginLeft:10}}>Lời mời kết bạn</p>
        </div>
        {/* Danh sách bạn bè */}
        <div style={{ display:'flex', alignItems:'center', width:370, height:80}}>
          <PiUserListBold style={{ marginLeft:30, fontSize:30}}/>
          <p style={{ fontSize:20, marginLeft:10}}>Danh sách bạn bè ({listFriend.length})</p>
        </div>
        {listFriend.map((item,index)=>
          <div
          key={item._id} 
          style={{ display: 'flex', alignItems: 'center', width: '373px', height: '80px', padding: '10px 0', backgroundColor: '#EEEEEE', width: '100%' }}
          >
          <div style={{height:'100%',width:'25%',display:'flex',justifyContent:'center',alignItems:'center'}} 
          onClick={async () => {
            try {
                const member = [];
                const response = await axios.post(createChatPrivate, {
                    user1: me._id,
                    user2: item._id
                });
                console.log('Đã tạo thành công:', me.fullname, item.fullname);
                console.log('Response data:', response.data);
                member.push(me._id,item._id)
                renderChat(member);
            } catch (error) {
                const member = [];
                member.push(me._id,item._id)
                renderChat(member);
                console.log('tạo chat thất bại:', me.fullname, item.fullname);
                console.log('Error:', error.response.data); // Log lỗi trả về từ máy chủ
            }
        }}>
            <Avatar src={item.avatar} style={{width:60,height:60,marginLeft:30, fontSize:30}}/>
          </div>
          <div style={{height:'100%',width:'60%',display:'flex',justifyContent:'center',alignItems:'center'}}>
          <p style={{ fontSize:20, marginLeft:10}}>{item.fullname}</p>
          </div>
          <div style={{height:'100%',width:'15%',display:'flex',justifyContent:'center',alignItems:'center'}}>
          <AiOutlineUserDelete onClick={()=>deleteFriend(me._id,item._id)} style={{width:30,height:30}}/>
          </div>
          </div>
        )}
      </div>
    </div>
  );
}