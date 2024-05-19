import {
  SearchOutlined,
  UsergroupAddOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Avatar, notification ,Modal} from "antd";
import React, { useState, useEffect, useRef } from "react";
import API_CONFIG from "../../api/apiconfig";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoMdExit } from "react-icons/io";
import { IoTrashBinOutline } from "react-icons/io5";
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
import {
  deleteMessageAPI,
  retrieveMessages,
  notificationMessage,
} from "../../api/apiMessager";
import EmojiPicker from "emoji-picker-react";
import {
  addAdminToChatGroup,
  addMembersToChatGroup,
  allUsers,
  deleteChatGroup,
  deleteMembersChatGroup,
  getAllChatGroupByUserId,
  getAllFriends,
  getAllMessagesByChatId,
  outchatgroup,
  sendMessagetoServer,
  forwardMessage,
} from "../../api/allUser";
import { CiEdit } from "react-icons/ci";
import { FaRegBell } from "react-icons/fa";
export default function ChatWindow() {
  const i4 = useSelector((state) => state.chat.item);
  const dispatch = useDispatch();
  const roomInfo = useSelector((state) => state.chat.info);
  // console.log("roomInfo::", roomInfo);
  let rommData = useSelector((state) => state.chat.item);
  // console.log("rommData::", rommData);

  const users = useSelector((state) => state.user.users); // Lấy danh sách người dùng từ state của Redux
  const [listGroup, setlisGroup] = useState([]);
  const [listFriend, setListFriends] = useState([]);
  const [isOpenAddgroup, setIsOpenAddGroup] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [memberadd, setmemberadd] = useState([]);
  const [memberId, setmemberId] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(""); // State cho tin nhắn mới
  const [chatId, setChatId] = useState("");
  const userId = localStorage.getItem("userId");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [file, setFile] = useState(null);
  const messagesEndRef = useRef(null);
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const onEmojiClick = (emojiObject) => {
    console.log("Current message:", newMessage); // Check current message content
    console.log("Emoji to add:", emojiObject.emoji); // Ensure this is the correct emoji character
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const navigate = useNavigate();
  const Menu = ({ onAddMember, onRemoveGroup, onDissolveGroup }) => (
    <div
      style={{
        position: "absolute", // Adjust according to your layout
        backgroundColor: "white",
        boxShadow: "0px 4px 8px rgba(0,0,0,0.25)",
        padding: "10px",
        borderRadius: "5px",
        zIndex: 100, // Ensure it's above other elements
        right: 50,
      }}
    >
      <ul style={{ listStyle: "none", padding: 10 }}>
        <li>
          <button
            style={{
              backgroundColor: "white",
              borderRadius: "5px",
              marginTop: "10px",
              borderColor: "red",
              width: 150,
              display: "flex", // Make sure the contents of the button are flex to align icon and text
              alignItems: "center", // Align items vertically
              justifyContent: "center", // Center the contents horizontally
            }}
            onClick={onRemoveGroup}
          >
            <IoMdExit style={{ marginRight: 8, color: "red" }} />{" "}
            <span style={{ color: "red" }}>Rời nhóm</span>
          </button>
        </li>
        <li>
          <button
            style={{
              backgroundColor: "white",
              borderRadius: "5px",
              marginTop: "10px",
              borderColor: "red",
              width: 150,
              display: "flex", // Make sure the contents of the button are flex to align icon and text
              alignItems: "center", // Align items vertically
              justifyContent: "center", // Center the contents horizontally
            }}
            onClick={onDissolveGroup}
          >
            <IoTrashBinOutline style={{ marginRight: 8, color: "red" }} />
            <span style={{ color: "red" }}>Giải tán nhóm</span>
          </button>
        </li>
      </ul>
    </div>
  );

  const handleRemoveGroup = async () => {
    const userId = localStorage.getItem("userId"); // Assuming you store userId in localStorage
    const chatGroupId = roomInfo._id; // Assuming roomInfo contains the chat group ID
    console.log("phongggggggggg", userId, chatGroupId);
    try {
      const response = await axios.delete(outchatgroup, {
        data: { userId: userId, chatGroupId: chatGroupId },
      });
      console.log("Successfully left group:", response.data);
      notification.success({
        message: "You have successfully left the group.",
      });
      navigate("/home"); // Redirect user after leaving the group
    } catch (error) {
      console.error("Failed to leave group:", error);
      notification.error({
        message: "Failed to leave the group. Please try again.",
        description:
          error.response?.data.message || "An unexpected error occurred.",
      });
    }
  };

  const handleDissolveGroup = async () => {
    const adminId = localStorage.getItem("userId");
    const token = localStorage.getItem("userToken");
    const chatGroupId = roomInfo._id; // Ensure this is correctly retrieved and exists

    console.log("Attempting to dissolve group:", token, adminId, chatGroupId);

    if (!token || !adminId || !chatGroupId) {
      notification.error({
        message:
          "Authentication or identification error. Please ensure you're logged in and try again.",
      });
      return;
    }

    try {
      const response = await axios.delete(
        `${deleteChatGroup}${adminId}`, // Assuming chatGroupId should be part of the URL
        {
          data: {
            // 'data' is used for sending the body in DELETE requests
            chatGroup: roomInfo._id,
          },
          headers: {
            Authorization: `${token}`, // Correctly formatting the Authorization header
          },
        }
      );
      notification.success({
        message: "Group successfully dissolved.",
      });
      navigate("/home"); // Assuming this is your intended redirect on success
    } catch (error) {
      console.error("Failed to dissolve group:", error);
      notification.error({
        message: "Failed to dissolve group. Please try again.",
        description:
          error.response?.data.message || "An unexpected error occurred.",
      });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ block: "end", inline: "nearest" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages(rommData);
  }, [rommData]);
  // Xử lý thay đổi file
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    console.log("File đã chọn:", setFile);
  };
  // check duoi file
  const getFileExtensionFromUrl = (url) => {
    // Tách phần mở rộng từ URL và chuyển đổi thành chữ thường
    const parts = url.split(".");
    const extension = parts[parts.length - 1].toLowerCase();
    return extension;
  };
  // Hàm mới để xử lý việc gửi tin nhắn
  const handleSendMessage = async () => {
    if (!newMessage.trim() && !file) return; // Không gửi nếu không có nội dung hoặc file

    try {
      let messageType = "text";
      let messageContent = "";
      let imageContent = "";
      let videoContent = "";
      let fileContent = "";
      const messageData = {
        sender: userId,
        message: newMessage,
        chatId: chatId,

        file: file,
      };

      const img = await sendMessageToServer(newMessage, file);
      console.log("img", img.views);
      console.log("img", img.files.length);
      if (img.views.includes(userId)) {
        if (img.views.includes(userId) && img.files && img.files[0]) {
          const fileExtension = getFileExtensionFromUrl(img.files[0]);
          console.log("fileExtension", fileExtension);
          if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
            messageType = "image";
            messageContent = "";
            imageContent = img.files[0];
          } else if (["mp4", "mov", "avi"].includes(fileExtension)) {
            messageType = "video";
            messageContent = "";
            videoContent = img.files[0];
          } else {
            messageType = "file";
            messageContent = "";
            fileContent = img.files[0];
          }
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
        messageId: Math.random().toString(36).substr(2, 9),
      });
      // const deletedMessages = new Set(JSON.parse(localStorage.getItem('deletedMessages') || '[]'));
      // setMessages(currentMessages => [...currentMessages, {...newMessage, isDeleted: deletedMessages.has(newMessage.messageId)}]);
      setFile(null);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      notification.error({
        message: "Failed to send message. Please try again.",
      });
    }

    // sendMessageToServer(newMessage, file); // Gửi file cùng với tin nhắn
  };
  // truyền tin nhắn lên server
  const sendMessageToServer = async (messageText, files) => {
    try {
      const formData = new FormData();
      formData.append("messageText", messageText);
      formData.append("sender", userId);
      formData.append("files", files);
      const isGroup = listGroup.some((group) => group._id === roomInfo._id);
      // Nếu là nhóm, sử dụng chatGroupId, ngược lại sử dụng chatPrivateId
      if (isGroup) {
        formData.append("chatGroupId", roomInfo._id);
      } else {
        formData.append("chatPrivateId", roomInfo._id);
      }
      // formData.append("chatGroupId", roomInfo._id);

      //

      const response = await axios.post(sendMessagetoServer, formData);

      console.log("Message sent:", response.data);
      setUpdateTrigger((prev) => !prev); // Toggle to trigger useEffect
      return response.data;
    } catch (error) {
      console.error(error.response?.data.error);
      return error.response;
    }
  };
  //Cập nhật lại tin nhắn khi có tin nhắn mới mà không cần load lại trang
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${getAllMessagesByChatId}${roomInfo._id}`
        );
        console.log("Updated messages:", response.data);
        dispatch(saveChatItem(response.data)); // Assuming you are using Redux to manage state
      } catch (error) {
        console.error("Error fetching updated messages:", error);
      }
    };

    fetchMessages();
  }, [updateTrigger]);

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
      _id: userId,
    };

    return newMessage;
  }

  // Giả sử messageData có dạng như sau, bạn cần điều chỉnh theo dữ liệu thực tế

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      const getChatData = async (chatId) => {
        try {
          const response = await axios.get(
            `${getAllMessagesByChatId}${chatId}`
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
  //-------------------------------------------------------------------------------
  // Hàm xóa tin nhắn
  const handleDeleteMessage = async (messageId) => {
    const messageIndex = messages.findIndex(
      (message) => message._id === messageId
    );

    if (messageIndex !== -1) {
      const deletedMessages = new Set(
        JSON.parse(localStorage.getItem("deletedMessages") || "[]")
      );

      deletedMessages.add(messageId);

      localStorage.setItem(
        "deletedMessages",
        JSON.stringify([...deletedMessages])
      );

      const updatedMessage = {
        ...messages[messageIndex],
        text: "",
        image: "",
        video: "",
        file: "",
        isDeleted: true,
        createdAt: "",
      };

      const updatedMessages = [...messages];
      updatedMessages[messageIndex] = updatedMessage;

      setMessages(updatedMessages);

      notification.success({ message: "Tin nhắn đã được xóa." });

      try {
        await deleteMessageAPI(messageId);
        console.log("Tin nhắn đã được xóa trên backend.");
      } catch (error) {
        console.error("Failed to log message deletion on the backend:", error);
        notification.error({
          message: "Error logging deletion on the backend.",
        });
      }
    } else {
      console.log("Tin nhắn không tồn tại trong danh sách.");
    }
  };

  useEffect(() => {
    // Load deleted messages from local storage
    const deletedMessages = new Set(
      JSON.parse(localStorage.getItem("deletedMessages") || "[]")
    );

    setMessages((currentMessages) => {
      return currentMessages.map((msg) => {
        if (deletedMessages.has(msg._id)) {
          return { ...msg, isDeleted: true };
        }
        return msg;
      });
    });
  }, [rommData]);
  const handleRecallMessage = async (messageId) => {
    try {
      const messageIndex = messages.findIndex(
        (message) => message._id === messageId
      );

      if (messageIndex === -1) {
        console.log("Tin nhắn không tồn tại trong danh sách.");
        return;
      }

      // Add messageId to the set of recalled messages
      const recalledMessages = new Set(
        JSON.parse(localStorage.getItem("retrieveMessages") || "[]")
      );
      recalledMessages.add(messageId);
      localStorage.setItem(
        "retrieveMessages",
        JSON.stringify([...recalledMessages])
      );

      // Update local state to reflect the recalled message
      const updatedMessages = messages.map((msg, index) =>
        index === messageIndex ? { ...msg, isRecall: true } : msg
      );
      setMessages(updatedMessages);

      // Show a successful recall message
      notification.success({ message: "Tin nhắn đã được thu hồi." });

      // Make API call to recall the message
      await retrieveMessages(messageId);
      notification.success({ message: "Tin nhắn đã được thu hồi." });
      const msck = messages.find((msg) => msg._id === messageId);
      const ms = {
        _id: messageId,
        text: "Tin nhắn đã được thu hồi",
        createdAt: msck.createdAt,
        user: {
          _id: msck.sender,
          avatar: msck.avatar,
        },
        image: "",
        video: "",
        file: "",
      };
      socket.emit("retrieveMessages", { roomId: roomInfo._id, ms });
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      notification.error({
        message: "An unexpected error occurred.",
        description: error.message || "Please try again later.",
      });
    }
  };

  useEffect(() => {
    // Load deleted messages from local storage
    const retrieveMessages = new Set(
      JSON.parse(localStorage.getItem("retrieveMessages") || "[]")
    );

    setMessages((currentMessages) => {
      return currentMessages.map((msg) => {
        if (retrieveMessages.has(msg._id)) {
          return { ...msg, isRecall: true };
        }
        return msg;
      });
    });
  }, [rommData]);
  useEffect(() => {
    socket.on("retrieveMessages", ({ messageId }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => {
          if (msg._id === messageId) {
            // Optionally remove the message or clear its content
            return {
              ...msg,
              content: { text: "", files: [] },
              isRecalled: true,
            };
          }
          return msg;
        })
      );
    });

    return () => socket.off("retrieveMessages");
  }, [rommData]);
  useEffect(() => {
    dispatch(allUsers());
    console.log(users);
  }, [dispatch]);
  //lấy tất cả chat
  const getListGroup = async () => {
    try {
      const res = await axios.get(`${getAllChatGroupByUserId}${userId}`);
      setlisGroup(res.data);
    } catch (error) {
      console.error("Error caught:", error);
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
      console.error("Error caught:", error);
    }
  };
  useEffect(() => {
    getListFriend();
  }, []);
  //
  const handleCheckboxChange = (e, itemId) => {
    if (e.target.checked) {
      setmemberadd((prevmemberadd) => [...prevmemberadd, itemId]); // Thêm itemId vào memberadd nếu checkbox được chọn
    } else {
      setmemberadd((prevmemberadd) =>
        prevmemberadd.filter((id) => id !== itemId)
      ); // Loại bỏ itemId khỏi memberadd nếu checkbox bị bỏ chọn
    }
  };
  const showCreateGroupButton = memberadd.length > 0;
  //thêm thành viên vào nhóm

  const addMember = async () => {
    const adminId = localStorage.getItem("userId"); // Get the current user's ID from localStorage
    const token = localStorage.getItem("userToken");

    if (!adminId) {
      notification.error({ message: "Authentication error. Please log in." });
      return; // Prevent the function from proceeding without a valid admin ID
    }

    try {
      const response = await axios.post(
        `${addMembersToChatGroup}${adminId}`,
        {
          // Include the adminId in the request
          chatGroupId: roomInfo._id,
          members: memberadd,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      notification.success({ message: "Thêm thành viên mới thành công." });
      getListGroup(); // Refresh the group list to show new members
      setIsOpenAddGroup(false); // Close the modal dialog
      setmemberadd([]); // Clear the array of member IDs after successful addition
    } catch (error) {
      console.log("++++++++++++", roomInfo._id, memberadd);
      console.error("Lỗi thêm thành viên:", error);
      notification.error({
        message: "Failed to add members. Please try again.",
      });
    }
  };
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  const handleSelectMember = (memberId) => {
    setSelectedMemberId(memberId);
  };

  const addAdmin = async () => {
    const adminId = localStorage.getItem("userId");
    const token = localStorage.getItem("userToken");

    if (!selectedMemberId) {
      notification.error({ message: "No member selected." });
      return;
    }

    try {
      const response = await axios.post(
        `${addAdminToChatGroup}${adminId}`,
        {
          chatGroupId: roomInfo._id,
          memberId: selectedMemberId,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      notification.success({ message: `Admin rights granted successfully.` });
      // Refresh logic here
    } catch (error) {
      console.log(
        "---------------------------------------",
        roomInfo._id,
        selectedMemberId
      );
      console.error("Error promoting member:", error);
      notification.error({
        message: "Failed to promote member. Please try again.",
      });
    }
  };

  // xóa thành viên khỏi nhóm
  const deletemember = async () => {
    const adminId = localStorage.getItem("userId");
    const token = localStorage.getItem("userToken");
    console.log(
      "111111111111111111111111",
      adminId,
      roomInfo._id,
      selectedMemberId,
      token
    );

    if (!token) {
      notification.error({
        message: "Authentication error. Please log in again.",
      });
      return;
    }

    try {
      // Ensure the URL is properly set to use chatGroupId, and parameters should be sent correctly
      const response = await axios.delete(
        `${deleteMembersChatGroup}${adminId}`,
        {
          data: {
            // 'data' is used for sending the body in DELETE requests
            chatGroupId: roomInfo._id,
            members: selectedMemberId,
          },
          headers: {
            Authorization: `${token}`, // Correctly formatting the Authorization header
          },
        }
      );
      notification.success({ message: "Xóa Thành Viên Thành công" });
      setIsOpenDelete(false);
    } catch (error) {
      console.error("Error", error);
      notification.error({
        message: "Failed to delete member. Please try again.",
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };

  // RENDER
  return (
    <div
      style={{
        width: "100%",
        background: "white",
        height: "100vh",
        borderRight: "1px solid #CCCCCC",
        display: "flex",
      }}
    >
      <div style={{ width: "65%", borderRight: "1px solid #CCCCCC" }}>
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

          {roomInfo.members && roomInfo.members.length > 2 && (
            <AiOutlineUsergroupAdd
              className="search-icon"
              style={{ cursor: "pointer" }}
              onClick={() => setIsOpenAddGroup(true)}
            />
          )}

          {isOpenAddgroup && (
            <div
              className="popup-overlay"
              onClick={() => {
                setIsOpenAddGroup(false);
                setmemberadd([]);
              }}
            >
              <div
                style={{
                  height: 500,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                className="popup-content"
                onClick={(e) => e.stopPropagation()}
              >
                <p>Thêm Thành Viên</p>
                <p>Tên Group: {roomInfo.name}</p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    overflowY: "scroll",
                  }}
                >
                  {listFriend
                    .filter((friend) => !roomInfo.members.includes(friend._id))
                    .map((item, index) => {
                      return (
                        <div
                          key={item._id}
                          style={{
                            border: "2px solid black",
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 10,
                            width: 400,
                            height: 50,
                            justifyContent: "space-between",
                            borderRadius: 10,
                            borderColor: "#76ABAE",
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {" "}
                            <Avatar
                              src={item.avatar}
                              style={{ width: 45, height: 45 }}
                            ></Avatar>
                            <p>{item.fullname}</p>
                          </div>

                          <input
                            style={{ marginRight: 20 }}
                            type="checkbox"
                            onChange={(e) => handleCheckboxChange(e, item._id)}
                          />
                        </div>
                      );
                    })}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    width: "100%",
                  }}
                >
                  <button
                    style={{ width: 150 }}
                    onClick={() => {
                      setIsOpenAddGroup(false);
                      setmemberadd([]);
                    }}
                  >
                    Đóng
                  </button>
                  {showCreateGroupButton && (
                    <button style={{ width: 150 }} onClick={addMember}>
                      Thêm Thành Viên
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <FiVideo className="search-icon" />
          <div style={{ position: "relative" }}>
            {roomInfo.members && roomInfo.members.length > 2 && (
              <>
                <PiListDashesBold
                  className="search-icon"
                  onClick={() => setShowMenu(!showMenu)}
                />
                {showMenu && (
                  <Menu
                    onRemoveGroup={handleRemoveGroup}
                    onDissolveGroup={handleDissolveGroup}
                  />
                )}
              </>
            )}
          </div>
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
          {messages.map((message, index) =>
            message.notification ? (
              <div
                key={message._id}
                style={{
                  
                  display: "flex",
                  top: "50%",
                 justifyContent: "center",
                  border:"none",         
                }}
              >
                <p>{message.content.text}</p>
              </div>
            ) : (
              <Message
                key={message._id}
                message={message}
                friendAvatar={roomInfo.avatar}
                onDelete={handleDeleteMessage}
                onRecall={handleRecallMessage}
              />
            )
          )}

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
            <div style={{ position: "relative" }}>
              <LuSmile className="search-icon" onClick={toggleEmojiPicker} />
              {showEmojiPicker && (
                <div
                  style={{ position: "absolute", bottom: "40px", left: "20px" }}
                >
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
              )}
            </div>
            <label htmlFor="file-input" className="file-input-label">
              <input
                id="file-input"
                style={{ display: "none" }}
                type="file"
                multiple
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
              onChange={(e) => {
                setNewMessage(e.target.value);
              }}
              placeholder="Nhập Tin Nhắn"
            ></input>

            {/* {chosenEmoji ? (
                <span>You chose: {chosenEmoji.emoji}</span>
            ) : (
                <span>No emoji Chosen</span>
            )} */}
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
      <div style={{ width: "35%" }}>
        <div
          style={{
            width: "100%",
            height: 60,
            borderBottom: "1px solid #CCCCCC",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h3>Thông Tin Hội Thoại</h3>
        </div>
        <div
          style={{
            width: "100%",
            height: 635,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflowY: "scroll",
            overflowX: "visible",
          }}
        >
          <Avatar
            style={{
              marginTop: 20,
              width: 60,
              height: 60,
              border: "2px solid white",
            }}
            src={roomInfo.avata}
          />
          <div style={{ marginTop: 10, display: "flex", flexDirection: "row" }}>
            <h3 style={{ marginTop: 4, marginLeft: 30 }}>{roomInfo.name}</h3>
            <div
              style={{
                background: "silver",
                marginLeft: 5,
                width: 30,
                height: 30,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
              }}
            >
              <CiEdit style={{ fontSize: 17 }} />
            </div>
          </div>
          <div
            style={{
              marginTop: 10,
              display: "flex",
              width: 200,
              alignItems: "center",
              justifyContent: "space-around",
              flexDirection: "row",
            }}
          >
            <div
              style={{
                backgroundColor: "silver",
                borderRadius: 50,
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
              }}
            >
              <FaRegBell style={{ fontSize: 25 }} />
            </div>
            <div
              style={{
                backgroundColor: "silver",
                borderRadius: 50,
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
              }}
            >
              <AiOutlineUsergroupAdd style={{ fontSize: 25 }} />
            </div>
          </div>
          {roomInfo.members.length > 2 && (
            <div
              style={{
                width: "100%",
                marginTop: 20,
                marginLeft: 20,
                display: "flex",
                alignItems: "center",
              }}
            >
              <h3 style={{ marginTop: 14 }}>Danh Sách Thành Viên</h3>
              <TeamOutlined
                style={{ cursor: "pointer" }}
                className="search-icon"
                onClick={() => setIsOpenDelete(true)}
              />
              {isOpenDelete && (
                <div
                  className="popup-overlay"
                  onClick={() => setIsOpenDelete(false)}
                >
                  <div
                    style={{
                      height: 500,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                    className="popup-content"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div>
                      <p>
                        Danh Sách Thành Viên ({roomInfo.members.length} thành
                        viên)
                      </p>
                      <p>Tên Group: {roomInfo.name}</p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        height: 300,
                        alignItems: "center",
                        overflowY: "scroll",
                      }}
                    >
                      {roomInfo.members.map((member) => {
                        const isAdmin = roomInfo.admin.includes(userId);
                        return (
                          <div
                            key={member._id}
                            style={{
                              backgroundColor:
                                member === roomInfo.admin.toString()
                                  ? "yellow"
                                  : "white",
                              border: "2px solid black",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: 10,
                              width: 450,
                              height: 50,
                            }}
                          >
                            <div>
                              <Avatar
                                src={
                                  users.find((item) => member === item._id)
                                    ?.avatar
                                }
                                style={{
                                  width: 45,
                                  height: 45,
                                  marginRight: 20,
                                }}
                              ></Avatar>
                            </div>
                            <div>
                              {
                                users.find((item) => member === item._id)
                                  ?.fullname
                              }
                            </div>
                            <div style={{ display: "flex" }}>
                              {isAdmin && member !== userId && (
                                <button
                                  style={{
                                    width: 130,
                                    height: 30,
                                    borderRadius: "5px",
                                    boder: "none",
                                    backgroundColor: "red",
                                  }}
                                  onClick={() => {
                                    deletemember(member);
                                  }}
                                >
                                  <span style={{ color: "white" }}>
                                    Xóa Thành Viên
                                  </span>
                                </button>
                              )}
                              {isAdmin && member !== userId && (
                                <button
                                  style={{
                                    width: 100,
                                    height: 30,
                                    borderRadius: "5px",
                                    backgroundColor: "#76ABAE",
                                  }}
                                  onClick={() => addAdmin(member)}
                                >
                                  <span style={{ color: "white" }}>
                                    Cấp quyền
                                  </span>
                                </button>
                              )}{" "}
                              {isAdmin && member !== userId && (
                                <button
                                  style={{
                                    boder: "none",
                                    backgroundColor: "white",
                                    color: "black",
                                    width: 100,
                                    height: 30,
                                    borderRadius: 5,
                                  }}
                                  onClick={() => handleSelectMember(member)}
                                >
                                  Chọn
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                        width: "100%",
                      }}
                    >
                      <button
                        style={{ width: 150 }}
                        onClick={() => setIsOpenDelete(false)}
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ width: "100%", marginTop: 20, marginLeft: 20 }}>
            <h3>Hình Ảnh</h3>
          </div>
          <div
            style={{
              width: "100%",
              marginTop: 20,
              display: "flex",
              flexDirection: "row",
              overflowY: "visible",
              overflowX: "scroll",
            }}
          ></div>
          <div style={{ width: "100%", marginTop: 20, marginLeft: 20 }}>
            <h3>File</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hàm hiển thị tin nhắn
function Message({ message, friendAvatar, onDelete, onRecall }) {
  const userId = localStorage.getItem("userId");
  const isMyMessage = message.sender === userId;
  const [showMenu, setShowMenu] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isOpenForward, setIsOpenForward] = useState(false);
  const [listChat, setListChat] = useState([]);
  const roomInfo = useSelector((state) => state.chat.info);
  let rommData = useSelector((state) => state.chat.item);
  const users = useSelector((state) => state.user.users);

   // lấy danh sách bạn bè để chuyển tiếp (tại ông backend chỉ để ChatPrivateID)
   const getListChat = async()=>{
    try {
      const res = await getAllFriends(userId);
      setListChat(res);
      // console.log(listChat);
    } catch (error) {
      console.error("Error caught:", error);
    }
  }
  // chuyển tiếp tin nhắn
  const sendforward = async (sender,chatPrivateId,messageId) => {
    console.log(forwardMessage)
    console.log(sender,chatPrivateId,messageId)
    try {
      const response = await axios.post(forwardMessage,{
        sender: sender,
        chatPrivateId:chatPrivateId,
        messageId:messageId
      });
        notification.success({message:'Success'})
        closeForward()
      } catch (error) {
        notification.error({ message: 'Failed to fetch. Please try again.' });
      }
  }
  // console.log("tbtbtbtbbtbt", rommData);
  const handleMouseEnter = () => {
    setShowMenu(true);
  };

  const handleMouseLeave = () => {
    setShowMenu(false);
  };
  useEffect(() => {
    setMessages(rommData);
  }, [rommData]);
  const openForward = () => {
    console.log('open');
    console.log(listChat)
    setIsOpenForward(true);
  };

  const closeForward = () => {
    console.log('close');
    setIsOpenForward(false);
  };
  useEffect(()=>getListChat,[])
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

  // Nghe sự kiện xóa tin nhắn từ server
  useEffect(() => {
    const handleDeletedMessagesRecall = (data) => {
      if (data && data.updatedMessages) {
        // Cập nhật tin nhắn dựa trên dữ liệu nhận được từ server
        const newMessages = messages.map((msg) => {
          const found = data.updatedMessages.find(
            (uMsg) => uMsg._id === msg._id
          );
          return found ? { ...msg, ...found } : msg;
        });
        setMessages(newMessages);
      }
    };

    socket.on("deletedMessageRecall", handleDeletedMessagesRecall);

    // Dọn dẹp
    return () => {
      socket.off("deletedMessageRecall", handleDeletedMessagesRecall);
    };
  }, [messages]); // Phụ thuộc vào messages để đảm bảo cập nhật state chính xác
  useEffect(() => {
    const handleretRievedMessageRecall = (data) => {
      if (data && data.updatedMessages) {
        // Cập nhật tin nhắn dựa trên dữ liệu nhận được từ server
        const newMessages = messages.map((msg) => {
          const found = data.updatedMessages.find(
            (uMsg) => uMsg._id === msg._id
          );
          return found ? { ...msg, ...found } : msg;
        });
        setMessages(newMessages);
      }
    };

    socket.on("retrievedMessageRecall", handleretRievedMessageRecall);

    // Dọn dẹp
    return () => {
      socket.off("retrievedMessageRecall", handleretRievedMessageRecall);
    };
  }, [messages]);
  return (
    <div
      className={`message-row ${isMyMessage ? "my-message" : "friend-message"}`}
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: isMyMessage ? "flex-end" : "flex-start",
        margin: "5px",
        position: "relative",
      }}
    >
      {!isMyMessage && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Avatar
            src={users.find((item) => message.sender === item._id)?.avatar}
            style={{ width: 30, height: 30, marginRight: 8 }}
          />
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: isMyMessage ? "flex-end" : "flex-start",
        }}
      >
        <p>{users.find((item) => message.sender === item._id)?.fullname}</p>
        <div
          className="message-content"
          style={{
            display: "inline-block",
            background: isMyMessage ? "#DCF8C6" : "#e4e6eb",
            padding: "10px",
            borderRadius: "15px",
            maxWidth: "100%",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* {message.content.text && <p>{message.content.text}</p>}
        {message.content.files && message.content.files.map(renderFileContent)} */}
          {message.isDeleted ? (
            <p style={{ fontStyle: "italic", color: "grey" }}>
              Tin nhắn đã được xóa ở phía bạn
            </p>
          ) : message.isRecall ? ( // Add this condition to check if the message is recalled
            <p style={{ fontStyle: "italic", color: "grey" }}>
              Tin nhắn đã được thu hồi
            </p>
          ) : (
            <>
              {message.content.text && <p>{message.content.text}</p>}
              {message.content.files &&
                message.content.files.map((file, index) =>
                  renderFileContent(file, index)
                )}
            </>
          )}

          {showMenu && (
            <div
              style={{
                position: "absolute",
                top: 10,
                left: isMyMessage ? null : "calc((100% - 100%)+auto)", // Menu on the right for friend's message
                right: isMyMessage ? "calc(100% - 100%)" : null, // For your message, menu appears on the left
                width: "120px",

                background: "#fff",
                border: "1px solid #ccc",
                padding: "5px 10px",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                zIndex: 1000, // Ensure it's above other elements
              }}
            >
              <button
                style={{
                  display: "block",
                  width: "100%",
                  backgroundColor: "#76ABAE",
                  border: "none",
                  borderRadius: "5px",
                }}
                onClick={openForward}
              >
                Chuyển tiếp
              </button>
              <Modal width="500px" centered={true} style={{ height: '300px' }} title="Chuyển Tiếp Tin Nhắn" visible={isOpenForward} onCancel={closeForward} footer={null}>
              <div
                  style={{
                    display: "flex",
                    height:300,
                    width:450,
                    flexDirection: "column",
                    alignItems: "center",
                    overflowY: "scroll",
                  }}
                >
                  {
                    listChat.map((item, index) => {
                      return (
                        <div
                          key={item._id}
                          style={{
                            border: "2px solid black",
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 10,
                            width: 400,
                            height: 50,
                            justifyContent: "space-between",
                            borderRadius: 10,
                            borderColor: "#76ABAE",
                          }}
                        >
                          <div
                            style={{ display: "flex",width:'100%',flexDirection:'row',alignItems: "center",justifyContent:'space-around' }}
                          >
                            <div style={{width:100,height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
                              <Avatar
                                src={item.avatar}
                                style={{ width: 40, height: 40 }}
                              ></Avatar>
                            </div>     
                            <div style={{width:150,height:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
                              <p style={{marginLeft:5}}>{item.fullname}</p></div>                     
                            {/*Chuyển TIếp Tin Nhắn*/}
                            <button onClick={()=>sendforward(userId,item.chatPrivate.filter((id) => users.filter((user) => user._id == userId).shift().chatPrivate.includes(id)).shift(),message._id)}>Gửi</button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </Modal>
              {message.sender === userId && (
                <button
                  style={{
                    display: "block",
                    width: "100%",
                    backgroundColor: "#76ABAE",
                    border: "none",
                    borderRadius: "5px",
                    marginTop: "5px",
                  }}
                  onClick={() => onRecall(message._id)}
                >
                  Thu hồi
                </button>
              )}
              {message.sender === userId && (
                <button
                  style={{
                    display: "block",
                    width: "100%",
                    backgroundColor: "#76ABAE",
                    border: "none",
                    borderRadius: "5px",
                    marginTop: "5px",
                  }}
                  onClick={() => onDelete(message._id)}
                >
                  Xóa
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {isMyMessage && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Avatar
            src={users.find((item) => message.sender === item._id)?.avatar}
            style={{ width: 30, height: 30, marginLeft: 8 }}
          />
        </div>
      )}
    </div>
  );
}
