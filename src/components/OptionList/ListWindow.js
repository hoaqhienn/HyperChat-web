import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar, List, notification ,Button} from 'antd';
import {useSelector} from 'react-redux';
import {getRequests, getData} from '../../api/allUser';
const ListWindow = () => {
 
  const users = useSelector(state => state.user.users);
  const me = useSelector(state => state.auth.user);
  const [requests, setRequests] =React.useState([]);
 

  //getRequests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await getRequests(me._id);
        setRequests(res);
      } catch (error) {
        console.error('Error caught:', error);
      }
    };
    fetchRequests();
  }, []);
  console.log('Requests:', requests);
  const handleAccept = async (userId) => {
    try {
      // Assuming 'userId' is the ID of the sender (the person who sent the friend request)
      // and 'me._id' is the ID of the receiver (the person who is accepting the request).
      const response = await axios.post('http://localhost:5000/api/friends/acceptFriendRequest', {
        sender: userId,
        receiver: me._id,
      });

      console.log('Friend request accepted:', response.data);
      // Show a success notification
      notification.success({
        message: 'Request Accepted',
        description: 'The friend request has been successfully accepted.'
      });

      // Optionally, refresh the list of requests here to reflect the changes.
      // This could involve calling `fetchRequests` again or removing the accepted request from the state.
      const updatedRequests = requests.filter(request => request._id !== userId);
      setRequests(updatedRequests);

    } catch (error) {
      console.error('Failed to accept friend request:', error);
      notification.error({
        message: 'Failed',
        description: 'Failed to accept friend request.'
      });
    }
  };



  const handleReject = async (userId) => {
    try {
      console.log('Rejecting friend request from:', userId, 'Me:', me._id);
      
      // Corrected usage of axios.delete with request body
      const response = await axios.delete('http://localhost:5000/api/friends/deleteFriendRequest', {
        data: { sender: userId, receiver: me._id },
      });
  
      console.log('Friend request rejected:', response.data);
      // Show a success notification
      notification.success({
        message: 'Request Rejected',
        description: 'The friend request has been successfully rejected.'
      });
  
      // Refresh the list of requests here to reflect the changes
      const updatedRequests = requests.filter(request => request._id !== userId);
      setRequests(updatedRequests);
  
    } catch (error) {
      console.error('Failed to reject friend request:', error);
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
              avatar={<Avatar src={item.avatar} />} // Changed 'source' to 'src'
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
