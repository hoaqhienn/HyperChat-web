import { SearchOutlined, TeamOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { Avatar, notification } from "antd";
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { FiVideo } from "react-icons/fi";
import { PiListDashesBold } from "react-icons/pi";
import { AiTwotoneLike } from "react-icons/ai";
import { IoSend } from "react-icons/io5";
import { LuSticker } from "react-icons/lu";
import { LuImage } from "react-icons/lu";
import { LuSmile } from "react-icons/lu";
import { LuFile } from "react-icons/lu";
import "../css/ChatWIndow.css";
import { socket } from "../../socket/socket";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getFriendSuccess } from "../../redux/friendSlice";
import { saveChatItem } from "../../redux/chatSlice";
import { allUsers, getAllFriends } from "../../api/allUser";
import { CiEdit } from "react-icons/ci";
import { FaRegBell } from "react-icons/fa";

export default function ChatWindow() {
  const i4 = useSelector((state) => state.chat.item);
  const roomInfo = useSelector((state) => state.chat.info);
  // console.log("roomInfo::", roomInfo);
  let rommData = useSelector((state) => state.chat.item);
  // console.log("rommData::", rommData);
  const users = useSelector(state => state.user.users); // Lấy danh sách người dùng từ state của Redux
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(""); // State cho tin nhắn mới
  const [chatId, setChatId] = useState("");
  const userId = localStorage.getItem("userId");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [file, setFile] = useState(null);
  const messagesEndRef = useRef(null);
  const [listGroup,setlisGroup] = useState([]);
  const [listFriend, setListFriends] = useState([]);
  const [isOpenAddgroup, setIsOpenAddGroup] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [memberadd, setmemberadd] = useState([]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ block: "end", inline: "nearest" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages(rommData);
  }, [rommData]);
  useEffect(() => {
    dispatch(allUsers());
    console.log(users)
  }, [dispatch]);
  //lấy tất cả chat
  const getListGroup = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/chat/getAllChatGroupByUserId/${userId}`);
      setlisGroup(res.data);
    } catch (error) {
      console.error('Error caught:', error);
    }
  };
  useEffect(() => {
    getListGroup();
  }, []);
  // lấy tất cả bạn bè
  const getListFriend = async () => {
    try {
      const res = await getAllFriends(userId);
      setListFriends(res);
      console.log(listFriend);
    } catch (error) {
      console.error('Error caught:', error);
    }
  };
  useEffect(() => {
    getListFriend();
  }, []);
  //
  const handleCheckboxChange = (e, itemId) => {
    if (e.target.checked) {
      setmemberadd(prevmemberadd => [...prevmemberadd, itemId]); // Thêm itemId vào memberadd nếu checkbox được chọn
    } else {
      setmemberadd(prevmemberadd => prevmemberadd.filter(id => id !== itemId)); // Loại bỏ itemId khỏi memberadd nếu checkbox bị bỏ chọn
    }
  };
  const showCreateGroupButton = memberadd.length > 0;
  //thêm thành viên vào nhóm
  const addMember = async()=>{
    try {
      const token =  localStorage.getItem('userToken');
      const response = await axios.post(`http://localhost:5000/api/chat/addMembersToChatGroup`,{
        chatGroupId: roomInfo._id,
        members: memberadd,
      },{
        headers: {
          "Authorization": token,
        },
      });
      notification.success({message: 'Thêm Thành công'})
      getListGroup();
      setIsOpenAddGroup(false);
      setmemberadd([]);

    } catch (error) {
      console.error('Lỗi', error);
      notification.error({ message: 'Failed to fetch friends list. Please try again.' });
    }
  }
  // Xóa Thành Viên
  const deletemember = async (choose) => {
    try {
        const response = await axios.delete(`http://localhost:5000/api/chat/deleteMembersChatGroup/${roomInfo._id}`, {
            data: {
                admin: userId,
                members: choose,
            }
        });
        notification.success({ message: 'Xóa Thành Viên Thành công' });
        setIsOpenDelete(false);
    } catch (error) {
        console.error('Lỗi', error);
        notification.error({ message: 'Failed to fetch friends list. Please try again.' });
    }
}
  // useEffect(() => {
  //   const fetchChatList = async () => {
  //     try {
  //       const chatId = localStorage.getItem("userId");
  //       const response = await axios.get(
  //         `http://localhost:5000/api/user/getListChats/${chatId}`
  //       );
  //       setChatList(response.data);
  //       console.log(
  //         "Fetched chat list for user ID",
  //         chatId,
  //         ":",
  //         response.data
  //       );
  //     } catch (error) {
  //       console.error(
  //         "Error fetching chat list for user ID",
  //         chatId,
  //         ":",
  //         error
  //       );
  //       notification.error({
  //         message: "Failed to fetch chat list. Please try again.",
  //       });
  //     }
  //   };

  //   fetchChatList();
  // }, []);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    console.log("File đã chọn:", setFile);
  };
// check duoi file
  const getFileExtensionFromUrl = (url) => {
    // Tách phần mở rộng từ URL và chuyển đổi thành chữ thường
    const parts = url.split('.');
    const extension = parts[parts.length - 1].toLowerCase();
    return extension;
  };
  // Hàm mới để xử lý việc gửi tin nhắn
  const handleSendMessage = async () => {
    if (!newMessage.trim() && !file) return; // Không gửi nếu không có nội dung hoặc file

    try {

      let messageType = 'text';
      let messageContent = '';
      let imageContent = '';
      let videoContent = '';
      let fileContent = '';
      const messageData = {
        sender: userId,
        message: newMessage,
        chatId: chatId,
        file: file,
      };
  
       const img = await sendMessageToServer(newMessage, file);
       
       if (img.length > 0) {
        const fileExtension = getFileExtensionFromUrl( img[0]);

        if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
          messageType = 'image';
          messageContent = '';
          imageContent = img[0];
        } else if (['mp4', 'mov', 'avi'].includes(fileExtension)) {
          messageType = 'video';
          messageContent = '';
          videoContent =  img[0];
        }
        else {
          messageType = 'file';
          messageContent = '';
          fileContent =  img[0];
        }
      }

      socket.emit("sendMessage", {
        roomId: roomInfo._id,
        message: newMessage,
        senderId: userId,
        createdAt: new Date().toISOString(),
        image: imageContent,
        video: videoContent,
        file: fileContent, // Gửi file cùng với tin nhắn
        messageId: "123",
      })
      setFile(null);
      setNewMessage("");
    }
    catch (error) {
      console.error("Failed to send message:", error);
      notification.error({ message: "Failed to send message. Please try again." });
    }
    // sendMessageToServer(newMessage, file); // Gửi file cùng với tin nhắn
  };
  function transformMessage(original) {
    // Xác định các file đính kèm dựa trên trường image và video
    const files = [];
    if (original.image) files.push(original.image);
    if (original.video) files.push(original.video);
    if (original.file) files.push(original.file);

    // Tạo tin nhắn mới với định dạng mong muốn
    const newMessage = {
      content: {
        text: original.message ? original.message : "", // Dùng message nếu có, nếu không thì thông báo thu hồi
        files: files,
      },
      createdAt: original.createdAt || new Date().toISOString(), // Nếu không có createdAt, dùng thời gian hiện tại
      sender: original.senderId,
      _id: userId, // Giả sử _id được sinh ra mới, bạn cần thay thế bằng cách sinh ID thực tế
    };

    return newMessage;
  }
  const sendMessageToServer = async (messageText, files) => {
    try {
      const formData = new FormData();
      formData.append("messageText", messageText);
      formData.append("sender", userId);
      // Kiểm tra xem roomInfo._id có trong danh sách nhóm không
      const isGroup = listGroup.some(group => group._id === roomInfo._id);
      // Nếu là nhóm, sử dụng chatGroupId, ngược lại sử dụng chatPrivateId
      if (isGroup) {
        formData.append("chatGroupId", roomInfo._id);
      } else {
        formData.append("chatPrivateId", roomInfo._id);
      }
      formData.append("files", files);
      const response = await axios.post(
        "http://localhost:5000/api/message/sendMessage",
        formData
      );
      console.log("Message sent:", response.data);
      return response.data;
    } catch (error) {
      console.error(error.response?.data.error);
      return error.response;
    }
  };
  
  // Giả sử messageData có dạng như sau, bạn cần điều chỉnh theo dữ liệu thực tế

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      const getChatData = async (chatId) => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/message/getAllMessagesByChatId/${chatId}`
          );
          rommData = response.data;
        } catch (error) {
          console.error(
            "Error fetching messages for chat ID",
            chatId,
            ":",
            error
          );
        }
      };
      getChatData(roomInfo._id);
      let a = transformMessage(message);
      console.log("a-----------------------------------------", a);
      setMessages([...rommData, a]);
      console.log("messages", messages);
    });
  }, [rommData]);

  return (
    <div
      style={{
        display:'flex',
        flexDirection:'row',
        width: "100%",
        background: "white",
        height: "100vh",
        borderRight: "1px solid #CCCCCC",
      }}
    >
      <div style={{width:'65%',borderRight:'1px solid #CCCCCC'}} >
        <div
        style={{
          width: "100%",
          height: 60,
          borderBottom: "1px solid #CCCCCC",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            height: 60,
            borderBottom: "1px solid #CCCCCC",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Avatar
            style={{
              marginLeft: 10,
              width: 50,
              height: 50,
              border: "2px solid white",
            }}
            src={roomInfo.avatar}
          />
          <div
            style={{
              marginLeft: 20,
              width: 300,
              height: 50,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <p
              style={{
                marginTop: 3,
                marginBottom: 4,
                fontFamily: "Arial",
                fontWeight: 700,
              }}
            >
              {roomInfo.name}
            </p>
            <p style={{ color: "green", fontWeight: "bold" }}>Active</p>
          </div>
        </div>
        <SearchOutlined className="search-icon" />
        <AiOutlineUsergroupAdd className="search-icon" style={{cursor: 'pointer'}} onClick={() => setIsOpenAddGroup(true)} />
          {isOpenAddgroup && (
            <div className="popup-overlay" onClick={() => {setIsOpenAddGroup(false);setmemberadd([])}}>
              <div style={{height:500,display:'flex',flexDirection:'column',justifyContent:'space-between'}}className="popup-content" onClick={(e) => e.stopPropagation()}>
                <p>Thêm Thành Viên</p>
                <p>Tên Group: {roomInfo.name}</p>
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',overflowY:'scroll'}}>
                {listFriend.filter(friend => !roomInfo.members.includes(friend._id)).map((item,index) =>{
                  return(
                    <div 
                      key={item._id}
                      style={{border:'2px solid black',display:'flex',alignItems:'center',alignItems:'center',marginBottom:10,width:400,height:50}}>
                      <input style={{marginRight:20}} type="checkbox" onChange={(e) => handleCheckboxChange(e, item._id)} />
                      <Avatar src={item.avatar} style={{width: 45, height:45}}></Avatar>
                      <p>{item.fullname}</p>
                      </div>
                    )
                  })}
                </div>
                <div style={{display:'flex',justifyContent:'space-around',width:'100%'}}>
                  <button style={{width:150}} onClick={() => {setIsOpenAddGroup(false);setmemberadd([])}}>Đóng</button>
                  {showCreateGroupButton && <button style={{ width: 150 }} onClick={addMember}>Thêm Thành Viên</button>}
                </div>
              </div>
            </div>
          )}
        <FiVideo className="search-icon" />
        <PiListDashesBold className="search-icon" />
        </div>
        <div
        className="chatWindow"
        style={{
          overflowY: "auto",
          width: "100%",
          height: 550,
          background: "#76ABAE",
          borderBottom: "1px solid #CCCCCC",
        }}
      >
        {messages.map((message, index) => (
          <Message
            key={message._id}
            message={message}
            friendAvatar={roomInfo.avatar}
          />
        ))}
        <div ref={messagesEndRef} />
        </div>
        <div style={{ width: "100%", height: 100 }}>
        <div
          style={{
            width: "100%",
            height: 45,
            borderBottom: "1px solid #CCCCCC",
            display: "flex",
            alignItems: "center",
          }}
        >
          <LuSticker className="search-icon" />
          <LuSmile className="search-icon" />
          <label htmlFor="file-input" className="file-input-label">
            <input
              id="file-input"
              style={{ display: "none" }}
              type="file"
              onChange={handleFileChange}
            />
            <LuImage className="search-icon"></LuImage> 
          </label>
          <LuFile className="search-icon" />
        </div>
        <div
          style={{
            width: "100%",
            height: 55,
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            style={{
              border: "none",
              outline: "none",
              marginLeft: 15,
              width: "100%",
              height: 50,
              fontSize: 15,
            }}
            value={newMessage} // Cập nhật giá trị dựa vào state newMessage
            onChange={handleInputChange}
            placeholder="Nhập Tin Nhắn"
          ></input>
          {/* <button
            style={{ position: "absolute", right: 10 }}
            onClick={() => {
              handleSendMessage();
            }}
          >
            gui
          </button> */}
          <IoSend
            className="search-icon"
            onClick={() => {
              handleSendMessage();
            }}
          />
          {/* <AiTwotoneLike className="search-icon" /> */}
        </div>
        </div>
      </div>
      <div style={{width:'35%'}} >
      <div style={{width:'100%',height:60,borderBottom:'1px solid #CCCCCC',display:'flex',justifyContent:'center',alignItems:'center'}}>
        <h3>Thông Tin Hội Thoại</h3>
      </div>
      <div style={{width:'100%',height:635,display:'flex',flexDirection:'column',alignItems:'center',overflowY: 'scroll',overflowX:'visible'}}>
        <Avatar style={{marginTop:20,width:60,height:60,border: '2px solid white'}} src={roomInfo.avata} />
        <div style={{marginTop:10,display:'flex',flexDirection:'row' }}>
          <h3 style={{marginTop:4,marginLeft:30}}>{roomInfo.name}</h3>
          <div style={{background:'silver',marginLeft:5,width:30,height:30,borderRadius:20,alignItems:'center',justifyContent:'center',display:'flex'}}>
          <CiEdit style={{fontSize:17}}/>
          </div>
        </div>
        <div style={{marginTop:10,display:'flex',width:200,alignItems:'center',justifyContent:'space-around',flexDirection:'row'}}>
          <div style={{backgroundColor:'silver',borderRadius:50,width:40,height:40,alignItems:'center',justifyContent:'center',display:'flex'}}>
            <FaRegBell style={{fontSize:25}}/></div>
          <div style={{backgroundColor:'silver',borderRadius:50,width:40,height:40,alignItems:'center',justifyContent:'center',display:'flex'}}>
            <AiOutlineUsergroupAdd style={{fontSize:25}}/></div>
        </div>
        {roomInfo.members.length > 2 && (
  <div style={{width:'100%', marginTop:20, marginLeft:20, display:'flex', alignItems:'center'}}>
    <h3 style={{marginTop:14}}>Danh Sách Thành Viên</h3> 
    <TeamOutlined style={{cursor:'pointer'}} className="search-icon" onClick={() => setIsOpenDelete(true)}/>
    {isOpenDelete && (
      <div className="popup-overlay" onClick={() => setIsOpenDelete(false)}>
        <div style={{height:500,display:'flex',flexDirection:'column',justifyContent:'space-between'}}className="popup-content" onClick={(e) => e.stopPropagation()}>
          <div>
            <p>Danh Sách Thành Viên ({roomInfo.members.length} thành viên)</p>
            <p>Tên Group: {roomInfo.name}</p>
            <p>Chọn Thành Viên Muốn Xóa</p>
          </div>
          <div style={{display:'flex',flexDirection:'column',height:300,alignItems:'center',overflowY:'scroll'}}>
            {roomInfo.members.map((member) => {
              const isAdmin = roomInfo.admin.includes(userId);
              return (
                <div 
                  key={member._id}
                  style={{backgroundColor: member === roomInfo.admin.toString() ? 'yellow':'white',border:'2px solid black',display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10,width:400,height:50}}
                >
                  <div>
                    <Avatar src={users.find(item => member === item._id)?.avatar} style={{width: 45, height:45,marginRight:20}}></Avatar>
                  </div>
                  <div>{users.find(item => member === item._id)?.fullname}</div>
                  <div>{isAdmin && member !== userId && (
                    <button style={{ width: 120 }} onClick={()=>{deletemember(member)}}>Xóa Thành Viên</button>
                  )}</div>
                </div>
              );
            })}
          </div>
          <div style={{display:'flex',justifyContent:'space-around',width:'100%'}}>
            <button style={{width:150}} onClick={() => setIsOpenDelete(false)}>Đóng</button>
          </div>
        </div>
      </div>
    )}
  </div> 
)}

        <div style={{width:'100%',marginTop:20,marginLeft:20}}>
          <h3>Hình Ảnh</h3>
        </div>
        <div style={{width:'100%',marginTop:20,display:'flex',flexDirection:'row',overflowY: 'visible',overflowX:'scroll'}}>
        </div>
          <div style={{width:'100%',marginTop:20,marginLeft:20}}>
          <h3>File</h3>
        </div>
      </div>
    </div>
    </div>
  );
}
function Message({ message, friendAvatar }) {
  const userId = localStorage.getItem("userId"); // Assuming the user's ID is stored with this key
  const isMyMessage = message.sender === userId;
  const users = useSelector(state => state.user.users);
  const renderFileContent = (file, index) => {
    const fileExtension = file.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
      return (
        <img
          src={file}
          alt="Image attachment"
          style={{ width: "100px", height: "100px" }}
          key={index}
        />
      );
    } else if (["mp4", "mov", "avi"].includes(fileExtension)) {
      return (
        <video
          controls
          src={file}
          style={{ width: "200px", height: "300px" }}
          key={index}
        />
      );
    } else {
      return (
        <a
          href={file}
          download
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "block", marginTop: "5px" }}
          key={index}
        >
          Download File
        </a>
      );
    }
  };

  return (
    <div
      className={`message-row ${isMyMessage ? "my-message" : "friend-message"}`}
      style={{
        display: "flex",
        justifyContent: isMyMessage ? "flex-end" : "flex-start",
        margin: "5px",
      }}
    >
      {!isMyMessage && (
          <div style={{display:'flex',flexDirection:'column'}}>
            <Avatar src={users.find(item => message.sender === item._id)?.avatar} style={{ width: 30, height: 30, marginRight: 8 }}/>
          </div>
      )}
      <div style={{display:'flex',flexDirection:'column',alignItems: isMyMessage ? "flex-end" : "flex-start",}}>
        <p>{users.find(item => message.sender === item._id)?.fullname}</p>
      <div
        className="message-content"
        style={{
          display: "inline-block",
          background: isMyMessage ? "blue" : "red",
          padding: "10px",
          borderRadius: "15px",
          maxWidth: "100%",
        }}
      >
        <div style={{flex:1}}>{message.content.text && message.content.text}</div>
        {message.content.files && message.content.files.map(renderFileContent)}
      </div>
      </div>
      {isMyMessage && (
          <div style={{display:'flex',flexDirection:'column'}}>
            <Avatar src={users.find(item => message.sender === item._id)?.avatar} style={{ width: 30, height: 30, marginLeft: 8 }}/>
          </div>
      )}
    </div>
  );
}
