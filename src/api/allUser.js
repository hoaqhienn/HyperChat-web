import axios from 'axios';
import {
  getUsersStart,
  getUsersSuccess,
  getUsersFailure,
} from '../redux/userSlice';
import API_CONFIG from './apiconfig';

const allUsers = () => async dispatch => {
  dispatch(getUsersStart());

  try {
    const response = await axios.get(
      API_CONFIG.baseURL + API_CONFIG.endpoints.allUsers,
    );
    dispatch(getUsersSuccess(response.data));
    // console.log('All users:', response.data);
  } catch (error) {
    dispatch(getUsersFailure(error));
    console.error('Error while fetching all users', error);
  }
};

const getRequests = async userId => {
  const List = [];
  try {
    const res = await axios.get(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoints.getRequests}/${userId}`,
    );
    const requestData = res.data;
    const idArray = requestData.map(item => item.sender);

    for (let i = 0; i < idArray.length; i++) {
      const res = await axios.get(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.getUser}/${idArray[i]}`,
      );
      List.push(res.data);
      
    }
    return List;
    // return requestData;

  } catch (error) {
    console.error('Error caught:', error);
    throw error.response ? error.response.data.message : error.message;
  }
};


export {allUsers, getRequests};