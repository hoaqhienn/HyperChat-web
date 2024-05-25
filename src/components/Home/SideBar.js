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
import { createChatGroup, getAllChatGroupByUserId, getAllFriends, getAllMessagesByChatId, info, listchats, sendFriendRequest } from '../../api/allUser';


export default function SideBar() {
  const dispatch = useDispatch();
  const user1 = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const data = useSelector((state) => state.chat.item);

  const [searchTerm, setSearchTerm] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isOpenAddgroup, setIsOpenAddGroup] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [user, setUser] = useState(null);
  const [friendsList, setFriendsList] = useState([]);
  const [listFriend, setListFriends] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [memberGroup, setMemberGroup] = useState([]);
  const [listGroup, setListGroup] = useState([]);
  const [refreshGroups, setRefreshGroups] = useState(false);
  const navigate = useNavigate();
  const roomInfo = useSelector((state) => state.chat.info);

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
  // Lấy Danh Sách Bạn bè
  const getListFriend = async () => {
    try {
      const res = await getAllFriends(user1._id);
      setListFriends(res);
      console.log(listFriend);
    } catch (error) {
      console.error('Error caught:', error);
    }
  };
  useEffect(() => getListFriend, []);
  //lấy danh sách Nhóm 
  useEffect(() => {
    const getListGroup = async () => {
      try {
        const res = await axios.get(`${getAllChatGroupByUserId}${user1._id}`);
        setListGroup(res.data);
        console.log(res.data);
      } catch (error) {
        console.error('Error caught:', error);
      }
    };
    getListGroup();
  }, [refreshGroups]);
  // Quản lý việc lựa chọn thành viên trong group
  const handleCheckboxChange = (e, itemId) => {
    if (e.target.checked) {
      setMemberGroup(prevMemberGroup => [...prevMemberGroup, itemId]); // Thêm itemId vào memberGroup nếu checkbox được chọn
    } else {
      setMemberGroup(prevMemberGroup => prevMemberGroup.filter(id => id !== itemId)); // Loại bỏ itemId khỏi memberGroup nếu checkbox bị bỏ chọn
    }
  };
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
      await axios.post(sendFriendRequest, {
        sender: senderId,
        receiver: user._id
      });
      socket.emit('sendFriendRequest', {
        senderId: senderId,
        receiverId: user._id,
      });
      notification.success({ message: 'Lời mời kết bạn đã được gửi!' });
      setIsPopupOpen(false);
      setUser(null);
    } catch (error) {
      console.error('Failed to send friend request:', error);
      notification.error({ message: 'Không thể gửi lời mời kết bạn. Vui lòng thử lại.' });
    }
  };
  const fetchFriendsList = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`${listchats}${userId}`, {
      });
      setFriendsList(response.data);
      dispatch(getFriendSuccess(response.data));
    } catch (error) {
      console.error('Error fetching friends list:', error);
      console.log(listchats)
      notification.error({ message: 'Failed to fetch. Please try again.' });
    }
  };
  useEffect(() => fetchFriendsList, []);
  // Tạo Danh sách chat group
  const createGroup = async () =>{
    try {
      const response = await axios.post(createChatGroup,{
        admin: [user1._id],
        name: groupName,
        members: memberGroup.concat(user1._id),
      });
      console.log('Thêm Thành Công:',response.data)
      socket.emit('createGroup', {newGroup:response.data});
      setIsOpenAddGroup(false);
      setGroupName('');
      setMemberGroup([]);
      setRefreshGroups(prev => !prev); // Toggle để kích hoạt useEffect
      notification.success({ message: 'Group created successfully!' });
      fetchFriendsList();
    } catch (error) {
      console.error('Lỗi', error);
      notification.error({ message: 'Failed to fetch friends list. Please try again.' });
    }
  }
  const showCreateGroupButton = memberGroup.length >= 2;
  // const findFriend = async () => {
  //   try {
  //     const response = await axios.get(`http://localhost:5000/api/user/id/${user1}`, {});
  //     console.log("user:",user1);
  //     setFriendsList(response.data);
  //    dispatch(getFriendSuccess(response.data));
  //   } catch (error) {
  //     console.error('Error fetching friends list:', error);
  //     notification.error({ message: 'Failed to fetch friends list. Please try again.' });
  //   }
  // }

  const getChatData = async (chatId) => {
    try {
      const response = await axios.get(`${getAllMessagesByChatId}${chatId}`);
      console.log("Room-data:", response.data);
      dispatch(saveChatItem(response.data));

    } catch (error) {
      console.error('Error fetching messages for chat ID', chatId, ":", error);
    }
  }
  //RENDER
  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', borderRight: '1px solid #CCCCCC' }}>
      <div style={{ display: 'flex', width: '100%', height: 122, borderBottom: '1px solid #CCCCCC', alignItems: 'center' }}>
        <div style={{ background: '#e4e8ec', marginLeft: 10, display: 'flex', width: '80%', height: 30, borderRadius: 10 }}>
          <SearchOutlined style={{ marginLeft: 7, marginRight: 10, fontSize: 17, color: 'gray' }} />
          <input
            style={{ border: 'none', outline: 'none', borderRadius: 10, width: 100, background: '#e4e8ec' }}
            placeholder='Tìm Kiếm'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          >
          </input>
        </div>
        <div>
          <AiOutlineUserAdd style={{ fontSize: 20, cursor: 'pointer' }} onClick={() => setIsPopupOpen(true)} />
          {isPopupOpen && (
            <div className="popup-overlay" onClick={() => {setIsPopupOpen(false)}}>
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
                    <div style={{display:'flex',padding:10,flex:1,gap:10}}> <div> <Avatar src={user.avatar} style={{width: 45, height:45}}></Avatar></div>
                    <div> <p style={{ fontWeight: 'bold', fontSize: 15 }}>{user.userName}</p>
                      <p>{user.phoneNumber}</p></div></div>
                   
                    <div> <button style={{ width: 100, height: 30, backgroundColor: 'white', borderColor: '#76ABAE', borderWidth: '3px' }} onClick={handleSendFriendRequest}>Kết bạn</button></div>
                  </div>
                )}

                <div>
                  <button style={{backgroundColor:'#76ABAE',border:'1px',borderRadius:5,padding:'5px',marginLeft:'10px'}} onClick={() => setIsPopupOpen(false)}> <span style={{color:'white'}}>Đóng</span> </button>
                </div>
              </div>
            </div>
          )}
          <AiOutlineUsergroupAdd style={{ fontSize: 20,  cursor: 'pointer' }} onClick={() => setIsOpenAddGroup(true)} />
          {isOpenAddgroup && (
            <div className="popup-overlay" onClick={() => setIsOpenAddGroup(false)}>
              <div style={{height:500,display:'flex',flexDirection:'column',justifyContent:'space-between'}}className="popup-content" onClick={(e) => e.stopPropagation()}>
                <p>Danh sách bạn bè</p>
                <input
                  style={{ width: 300, height: 30, borderRadius: 5, border: '1px solid #ccc', margin: '10px', padding: '5px' }}
                  type="text"
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  placeholder="Tên Group"
                />
                <div style={{display:'flex',flexDirection:'column',
                            alignItems:'center',overflowY:'scroll'}}>
                {listFriend.map((item,index) =>{
                  return(
                    <div 
                      key={item._id}
                      style={{border:'2px solid #76ABAE',borderRadius:10,display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10,width:400,height:50}}>
                     <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                     <Avatar src={item.avatar} style={{width: 45, height:45}}></Avatar>
                      <p>{item.fullname}</p>

                     </div>
                     
                      <input style={{marginRight:20}} type="checkbox" onChange={(e) => handleCheckboxChange(e, item._id)} />
                    </div>
                  )
                })} 
                </div>
                <div style={{display:'flex',justifyContent:'space-around',width:'100%'}}>
                  <button style={{height:25,width:150,backgroundColor:'#76ABAE',color:'white',borderRadius:7,border:'none'}} onClick={() => setIsOpenAddGroup(false)}>Đóng</button>
                  {showCreateGroupButton && <button style={{height:25,width:150,backgroundColor:'#76ABAE',color:'white',borderRadius:7,border:'none'}} onClick={createGroup}>Tạo Group</button>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* <div style={{borderBottom:'1px solid',display: 'flex',alignItems:'center',justifyContent: 'center', width: '373px', height: '80px', padding: '10px 0', backgroundColor: '#EEEEEE', width: '100%' }}>
        <p style={{fontSize: '15px', marginBottom: '5px', fontWeight: '600' }}>
        Group Chat {listGroup.length}</p> 
      </div>
      <div style={{ maxHeight: 'calc(50vh - 122px)',overflowY: 'scroll', flexDirection: 'column', width: '100%' }}>
        {listGroup.map((item) => {
          {
          return (
          <div
            key={item._id}
            style={{display: 'flex', alignItems: 'center', width: '373px', height: '80px', padding: '10px 0', backgroundColor: '#EEEEEE', width: '100%' }}
            onClick={() => {
              dispatch(saveChatInfo(item));
              console.log("Room-info:", item);
              getChatData(item._id);
              socket.emit('joinRoom', item._id, item.members);
              navigate(`/chatwithfriend`, { state: { friendId: item._id } })
            }}
          >
            <Avatar
              style={{ marginLeft: '10px', width: '60px', height: '60px', border: '2px solid white' }}
              src={item.avatar}
            />
            <div style={{ width: '280px', marginLeft: '10px', display: 'flex', flexDirection: 'column' }}>
              <p style={{ fontSize: '15px', marginBottom: '5px', fontWeight: '600' }}>{item.name}</p>
            </div>
          </div>
        );
        }
      })}
      </div> */}
      <div style={{maxHeight: 'calc(50vh - 122px)',borderBottom:'1px solid',display: 'flex',alignItems:'center',justifyContent: 'center', width: '373px', height: '80px', padding: '10px 0', backgroundColor: '#EEEEEE', width: '100%' }}>
        <p style={{fontSize: '15px', marginBottom: '5px', fontWeight: '600' }}>
        Chat</p> 
      </div>
      <div style={{ overflowY: 'scroll', flexDirection: 'column', width: '100%' }}>
        {friendsList.map((friend) => {
          {
          return (
          <div
            key={friend._id}
            style={{display: 'flex', alignItems: 'center', width: '373px', height: '80px', padding: '10px 0', backgroundColor: '#EEEEEE', width: '100%' }}
            onClick={() => {
              console.log(friend)
              dispatch(saveChatInfo(friend));
              console.log("Room-info:", friend);
              getChatData(friend._id);
              socket.emit('leaveAllRooms');
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
        );
        }
      })}
      </div>
    </div>
  )

}
