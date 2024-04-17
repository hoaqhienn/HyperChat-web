
import axios from 'axios';
import API_CONFIG from './apiconfig';
export const deleteMessageAPI = async (messageId) => {
    const userId = localStorage.getItem("userId");
    console.log('userId:', userId);
    console.log('messageId:', messageId);
    try {
      const res = await axios.put(
        API_CONFIG.baseURL + API_CONFIG.endpoints.deleteMessage,
        { userId, messageId } 
      );
      console.log('deleteMessage:', res.data);
      return res.data;
    } catch (error) {
      throw new Error('Error getting user data');
    }
  }
  export const retrieveMessages = async (messageId) => {
    try {
      const res = await axios.post(
        API_CONFIG.baseURL + API_CONFIG.endpoints.retrieveMessages + `/${messageId}`,
      );
      console.log('retrieveMessages:', res.data);
      return res.data;
    } catch (error) {
      throw new Error('Error getting user data');
    }
  }
  