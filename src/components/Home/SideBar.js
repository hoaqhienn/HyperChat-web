import { SearchOutlined } from '@ant-design/icons'
import { AiOutlineUserAdd, AiOutlineUsergroupAdd } from "react-icons/ai";
import { Avatar, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Tool.css';
import { socket } from '../../socket/socket';
import { getFriendSuccess } from '../../redux/friendSlice';
import { saveChatInfo, saveChatItem } from '../../redux/chatSlice';


export default function SideBar() {
  const dispatch = useDispatch();
  const user1 = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const data = useSelector((state) => state.chat.item);

  const [searchTerm, setSearchTerm] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [user, setUser] = useState(null);
  const [friendsList, setFriendsList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!phoneNumber) return;

    axios.get(`http://localhost:5000/api/user/phone/${phoneNumber}`)
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error('Failed to search user:', error);
        notification.error({ message: 'Lỗi tìm kiếm người dùng.' });
      });
  }, [phoneNumber]);

  const handleSendFriendRequest = async () => {
    if (!user || !user._id) {
      notification.error({ message: 'Vui lòng chọn một người dùng hợp lệ để gửi lời mời kết bạn.' });
      return;
    }

    // Kiểm tra xem người dùng có đang tự gửi lời mời cho chính mình không
    const senderId = localStorage.getItem('userId');
    if (user._id === senderId) {
      notification.error({ message: 'Bạn không thể gửi lời mời kết bạn cho chính mình.' });
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/friends/sendFriendRequest`, {
        sender: senderId,
        receiver: user._id
      });
      notification.success({ message: 'Lời mời kết bạn đã được gửi!' });
      setIsPopupOpen(false);
      setUser(null);
    } catch (error) {
      console.error('Failed to send friend request:', error);
      notification.error({ message: 'Không thể gửi lời mời kết bạn. Vui lòng thử lại.' });
    }
  };



  useEffect(() => {
    const fetchFriendsList = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`http://localhost:5000/api/user/getListChats/${userId}`, {

        });
        setFriendsList(response.data);
        dispatch(getFriendSuccess(response.data));
      } catch (error) {
        console.error('Error fetching friends list:', error);
        notification.error({ message: 'Failed to fetch. Please try again.' });
      }
    };

    fetchFriendsList();
  }, []);
  const findFriend = async () => {
   
    try {
      const response = await axios.get(`http://localhost:5000/api/user/id/${user1}`, {});
      console.log("user:",user1);
      setFriendsList(response.data);
     dispatch(getFriendSuccess(response.data));
    } catch (error) {
      console.error('Error fetching friends list:', error);
      notification.error({ message: 'Failed to fetch friends list. Please try again.' });
    }
  }

  const getChatData = async (chatId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/message/getAllMessagesByChatId/${chatId}`);
      console.log("Room-data:", response.data);
      dispatch(saveChatItem(response.data));

    } catch (error) {
      console.error('Error fetching messages for chat ID', chatId, ":", error);
    }
  }



  //RENDER
  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', borderRight: '1px solid #CCCCCC' }}>
      <div style={{ display: 'flex', width: '100%', height: 64.5, borderBottom: '1px solid #CCCCCC', alignItems: 'center' }}>
        <div style={{ background: '#e4e8ec', marginLeft: 10, display: 'flex', width: 270, height: 30, borderRadius: 10 }}>
          <SearchOutlined style={{ marginLeft: 7, marginRight: 10, fontSize: 17, color: 'gray' }} />
          <input
            style={{ border: 'none', outline: 'none', borderRadius: 10, width: 400, background: '#e4e8ec' }}
            placeholder='Tìm Kiếm'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          >

          </input>
        </div>
        <div>
          <AiOutlineUserAdd style={{ fontSize: 20, cursor: 'pointer' }} onClick={() => setIsPopupOpen(true)} />

          {isPopupOpen && (
            <div className="popup-overlay" onClick={() => setIsPopupOpen(false)}>
              <div className="popup-content" onClick={(e) => e.stopPropagation()}>

                <p>Thêm Bạn</p>
                <input
                  style={{ width: 300, height: 30, borderRadius: 5, border: '1px solid #ccc', margin: '10px', padding: '5px' }}
                  type="tel"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  placeholder="Số điện thoại"
                />
                {user && (
                  <div style={{ border: 1, borderColor: '#76ABAE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div> <p style={{ fontWeight: 'bold', fontSize: 15 }}>{user.userName}</p>
                      <p>{user.phoneNumber}</p></div>
                    <div> <button style={{ width: 100, height: 30, backgroundColor: 'white', borderColor: '#76ABAE', borderWidth: '3px' }} onClick={handleSendFriendRequest}>Kết bạn</button></div>


                  </div>
                )}

                <div>
                  <button style={{}} onClick={() => setIsPopupOpen(false)}>Đóng</button>
                </div>
              </div>
            </div>
          )}
          <AiOutlineUsergroupAdd style={{ fontSize: 20 }} />
        </div>

      </div>
      <div style={{ overflowY: 'scroll', flexDirection: 'column', width: '100%' }}>
        {friendsList.map((friend) => (
          <div
            key={friend._id}
            style={{ display: 'flex', alignItems: 'center', width: '373px', height: '80px', padding: '10px 0', backgroundColor: '#EEEEEE', width: '100%' }}
            onClick={() => {

              dispatch(saveChatInfo(friend));
              console.log("Room-info:", friend);

              getChatData(friend._id);

              socket.emit('joinRoom', friend._id, friend.members);
              navigate(`/chatwithfriend`, { state: { friendId: friend._id } })
            }}
          >
            <Avatar
              style={{ marginLeft: '10px', width: '60px', height: '60px', border: '2px solid white' }}
              src={friend.avatar}
            />
            <div style={{ width: '280px', marginLeft: '10px', display: 'flex', flexDirection: 'column' }}>
              <p style={{ fontSize: '15px', marginBottom: '5px', fontWeight: '600' }}>{friend.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

}

