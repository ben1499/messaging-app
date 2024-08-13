import { Box, Typography, CircularProgress } from "@mui/material";
import PersonImg from "../assets/person-placeholder.jpeg";
import styled from "@emotion/styled";
import Logo from "../assets/chat-logo.png";
import ListIcon from '@mui/icons-material/List';
import axiosInstance from "../config/axios";
import { useState, useEffect } from "react";
import Chat from "../components/Chat";

const StyledImg = styled.img`
  border-radius: 50%;
  height: 50px;
  width: 50px;
`;

const StyledChatSelect = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  gap: "2px",
  color: "red",
  borderBottom: "1px solid rgb(212 212 216)",
  padding: "14px 8px",
  cursor: "pointer",

  "&:hover": {
    background: "rgb(212, 212, 216, 0.6)"
  }
}));

function Home() {
  const url = import.meta.env.VITE_API_URL;
  const [users, setUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    axiosInstance.get(`${url}/users`)
    .then((res) => {
      setUsers(res.data.data);
    })
  }, [url]);

  const openChat = (user) => {
    return () => {
      setSelectedChat(user);
      axiosInstance.get(`${url}/messages`, {
        params: {
          to_user_id: user._id
        }
      })
    }
  }

  return (
    <>
      <Box sx={{ height: "100vh" }}>
        <Box sx={{ display: "flex", fontSize: "18px", alignItems: "center", gap: "6px", padding: "19.5px 0", px: 2, borderBottom: "1px solid rgb(212 212 216)" }}><ListIcon />Messages</Box>
        <Box sx={{ }}>
          {users.length ? users.map((user) => (
            <StyledChatSelect key={user._id} onClick={openChat(user)} sx={{ backgroundColor: selectedChat?._id === user._id ? "#D1E9F6" : "" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "6px"}}>
                <StyledImg src={user.image ? user.image.url : PersonImg} />
                <Box>
                  <Typography variant="p">{ `${user.first_name} ${user.last_name}` }</Typography>
                  <Typography variant="p" sx={{ fontSize: "14px", fontWeight: "300", display: "block", color: "grey" }}>{`Chat with ${user.first_name}`}</Typography>
                </Box>
              </Box>
            </StyledChatSelect>
          )) : <Box sx={{ height: "90vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <CircularProgress />
          </Box>}
        </Box>
      </Box>
      {selectedChat ? (
        <Chat user={selectedChat} />
      ) : (
      <Box sx={{ height: "100vh", backgroundColor: "rgb(239 241 242)" }}>
        <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <img src={Logo} width="80" alt="" />
          <Typography sx={{ fontWeight: "" }} variant="h3">Messaging app</Typography>
        </Box>
      </Box>
      )}
    </>
  )
}

export default Home;
