import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar, List, notification ,Button} from 'antd';
import {useSelector} from 'react-redux';
import {getRequests, getData} from '../../api/allUser';

const ListWindow = () => {
  // Lấy danh sách người dùng và thông tin của người dùng hiện tại từ Redux store
  const users = useSelector(state => state.user.users);
  const me = useSelector(state => state.auth.user);
  
  // State hook để lưu trữ danh sách các yêu cầu kết bạn
  const [requests, setRequests] = useState([]);
 
  // Effect hook để lấy danh sách yêu cầu kết bạn khi component được render
  const fetchRequests = async () => {
    try {
      // Gọi API để lấy danh sách yêu cầu kết bạn
      const res = await getRequests(me._id);
      // Cập nhật state với danh sách yêu cầu kết bạn
      setRequests(res);
    } catch (error) {
      console.error('Error caught:', error);
    }
  };
  useEffect(()=>{fetchRequests()},[]);
  
  // Xử lý chấp nhận yêu cầu kết bạn
  const handleAccept = async (userId) => {
    try {
      // Gọi API để chấp nhận yêu cầu kết bạn
      const response = await axios.post('http://localhost:5000/api/friends/acceptFriendRequest', {
        sender: userId,
        receiver: me._id,
      });
      
      console.log('Friend request accepted:', response.data);
      // Hiển thị thông báo thành công
      notification.success({
        message: 'Request Accepted',
        description: 'The friend request has been successfully accepted.'
      });

      // Cập nhật danh sách yêu cầu sau khi chấp nhận
      const updatedRequests = requests.filter(request => request._id !== userId);
      setRequests(updatedRequests);

    } catch (error) {
      console.error('Failed to accept friend request:', error);
      // Hiển thị thông báo lỗi
      notification.error({
        message: 'Failed',
        description: 'Failed to accept friend request.'
      });
    }
  };

  // Xử lý từ chối yêu cầu kết bạn
  const handleReject = async (userId) => {
    try {
      console.log('Rejecting friend request from:', userId, 'Me:', me._id);
      
      // Gọi API để từ chối yêu cầu kết bạn
      const response = await axios.delete('http://localhost:5000/api/friends/deleteFriendRequest', {
        data: { sender: userId, receiver: me._id },
      });
  
      console.log('Friend request rejected:', response.data);
      // Hiển thị thông báo thành công
      notification.success({
        message: 'Request Rejected',
        description: 'The friend request has been successfully rejected.'
      });
  
      // Cập nhật danh sách yêu cầu sau khi từ chối
      const updatedRequests = requests.filter(request => request._id !== userId);
      setRequests(updatedRequests);
  
    } catch (error) {
      console.error('Failed to reject friend request:', error);
      // Hiển thị thông báo lỗi
      notification.error({
        message: 'Failed',
        description: 'Failed to reject friend request.'
      });
    }
  };

  return (
    <div>
      <h2>Danh sách lời mời kết bạn</h2>
      <List
        itemLayout="horizontal"
        dataSource={requests}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button style={{backgroundColor:'#76ABAE'}} key="accept" type="primary" onClick={() => handleAccept(item._id)}>
                Chấp nhận
              </Button>,
              <Button key="reject" type="danger" onClick={() => handleReject(item._id)}>
                Từ chối
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={item.avatar} />} // Sử dụng thuộc tính src thay vì source
              title={item.userName}
              description={`Tên đầy đủ: ${item.fullname}`}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default ListWindow;
