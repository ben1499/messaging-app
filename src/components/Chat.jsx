import { Box, Typography, IconButton, Card, List, ListItemButton, Snackbar } from "@mui/material";
import PersonImg from "../assets/person-placeholder.jpeg";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import axiosInstance from "../config/axios";
import ChatBg from "../assets/chat-bg.jpg";
import SendIcon from '@mui/icons-material/Send';
import TagFacesIcon from '@mui/icons-material/TagFaces';
// import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import ArrowIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const StyledImg = styled.img`
  border-radius: 50%;
  height: 50px;
  width: 50px;
`;

const ChatContainer = styled(Card)(() => ({
  flex: "1",
  backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url(${ChatBg})`,
  display: "flex", 
  flexDirection: "column",
}));

const MetaInfo = styled(Card)(() => ({
  fontSize: "0.7rem",
  background: "none"
}));

const ChatMsg = styled(Card)(() => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "6px 8px",
}));

const StyledArrowIcon = styled(ArrowIcon)(() => ({
  opacity: "0",
  cursor: "pointer",
  width: "30px",

  "&:hover": {
    opacity: 1
  }
}));

const ChatInput = styled(Card)(() => ({
  backgroundColor: "white",
  margin: "0 auto",
  padding: "6px 8px",
  position: "relative",
  zIndex: "2",
  opacity: "1 !important",
  // marginBottom: "16px",
  display: "flex",
  justifyContent: "center",
  gap: "10px",

  "& > input": {
    width: "90%",
    border: "none",
    outline: "none",
  }
}));

function Chat({ user, onBack }) {
  const url = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [isSnackVisible, setSnackVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get(`${url}/messages/`, {
      params: {
        to_user_id: user._id
      }
    }).then((res) => {
      setMessages(res.data.data);
    })
  }, [url, user]);

  const togglePicker = () => {
    setIsPickerOpen(!isPickerOpen);
  }

  const handleEmojiClick = (value) => {
    setInput(input + value.native);
  }

  const handleInputChange = (e) => {
    setInput(e.target.value);
  }

  const fetchMessages = () => {
    axiosInstance.get(`${url}/messages/`, {
        params: {
          to_user_id: user._id
        }
      }).then((res) => {
      setMessages(res.data.data);
    })
  }

  const sendMessage = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosInstance.post(`${url}/messages`, {
      content: input,
      to_user_id: user._id
    }).then(() => {
      setInput("");
      fetchMessages();
    }).catch((err) => {
      console.log(err)
      setSnackMessage("Something went wrong. Please try again");
      setSnackVisible(true);
    })
    .finally(() => setLoading(false));
  }

  const toggleMsgOptions = (id) => {
    return () => {
      if (id === selectedMsg) {
        setSelectedMsg(null);
      } else {
        setSelectedMsg(id);
      }
    }
  }

  const handleMessageHoverLeave = () => {
    if (selectedMsg) {
      setSelectedMsg(null);
    }
  }

  const closeSnack = () => {
    setSnackVisible(false);
  }

  const deleteMessage = (id) => {
    return () => {
      axiosInstance.delete(`${url}/messages/${id}`)
      .then(() => {
        setSnackMessage("Message deleted");
        setSnackVisible(true);
        fetchMessages();
      }).catch((err) => {
        setSnackMessage("Something went wrong. Please try again")
        setSnackVisible(true);
        console.log(err);
      })
    }
  }

  const openProfile = (id) => {
    return () => {
      return navigate(`/profile/${id}`);
    }
  }

  return (
    <Box sx={{ height: { lg: "100vh", sm: "92vh", xs: "92vh" }, display: "flex", flexDirection: "column", borderLeft: "1px solid rgb(212 212 216)", position: "relative" }}>
      <Snackbar
        open={isSnackVisible}
        autoHideDuration={3000}
        onClose={closeSnack}
        message={snackMessage}
      />
      <Box sx={{ display: "flex", px: 2, py: 1, gap: "8px", borderBottom: "1px solid rgb(212 212 216)" }}>
        <IconButton onClick={onBack} sx={{ p: 0, display: { lg: "none"} }}><ArrowBackIcon /></IconButton>
        <StyledImg src={user.image ? user.image.url : PersonImg} alt="" />
        <Box>
          <Typography variant="p" sx={{ cursor: "pointer", "&:hover": { color: "#4E31AA"} }} onClick={openProfile(user._id)}>{`${user.first_name} ${user.last_name}`}</Typography>
          <Typography variant="p" sx={{ display: "block", fontSize: "14px" }}>{user.email}</Typography>
        </Box>
      </Box>
      {isPickerOpen ? (
        <Box sx={{ position: "absolute", top: { lg: "22rem", sm: "19rem", xs: "17rem"}, left: "20px" }}>
          <Picker
            emojiStyle="native"
            open={isPickerOpen}
            onEmojiSelect={handleEmojiClick}
          />
        </Box>
      ) : null}
      <ChatContainer>
        <Box sx={{ height: "90%", display: "flex", flexDirection: "column", padding: "0 12px", paddingTop: "16px", overflowY: "auto", paddingBottom: "36px" }}>
          {messages.map((message) => (
            <Box onMouseLeave={handleMessageHoverLeave} key={message._id} sx={{ position: "relative", alignSelf: message.is_current_user ? "flex-end" : "flex-start", marginBottom: "15px", display: "flex", flexDirection: "column" }}>
              <MetaInfo sx={{ alignSelf: message.is_current_user ? "flex-end" : "flex-start" }}>{ message.date_formatted}</MetaInfo>
              <ChatMsg 
                sx={{ borderTopRightRadius: message.is_current_user ? "0px" : "", borderTopLeftRadius: message.is_current_user ? "" : "0px", backgroundColor: !message.is_current_user ? "#F8EDED" : "#FFEBD4" }}>
                  <Box sx={{ maxInlineSize: { lg: "450px", sm: "250px", xs: "250px"}, overflowWrap: "break-word" }}>{message.content}</Box>
                  {message.is_current_user ? <StyledArrowIcon onClick={toggleMsgOptions(message._id)} /> : null }
              </ChatMsg>
              {selectedMsg === message._id ? (
                <List sx={{ position: "absolute", backgroundColor: "#fff", top: "50px", right: 0, width: "160px", zIndex: "100 !important", boxShadow: "1px 1px 1px 1px rgb(0,0,0,0.3)" }}>
                  <ListItemButton sx={{ fontSize: "14px"}} onClick={deleteMessage(message._id)}>Delete Message</ListItemButton>
                </List>
              ) : null}
            </Box>
          ))}
        </Box>
        <form action="">
          <ChatInput sx={{ width: { lg: "95%", sm: "90%", xs: "90%"}, mb: { lg: 2, sm: 1, xs: 1} }}>
            <IconButton onClick={togglePicker}><TagFacesIcon sx={{ color: '', '&:hover': { transform: 'scale(1.1)'} }} /></IconButton>
            <input type="text" placeholder="Send message" value={input} onChange={handleInputChange} />
            <IconButton type="submit" onClick={sendMessage} disabled={input === "" || loading ? true : false}><SendIcon sx={{ color: '', '&:hover': { transform: 'scale(1.1)'} }} /></IconButton>
          </ChatInput>
        </form>
      </ChatContainer>
    </Box>
  )
}

Chat.propTypes = {
  user: PropTypes.object,
  onBack: PropTypes.func
};

export default Chat;
