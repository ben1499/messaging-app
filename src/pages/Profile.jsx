import { 
  Box, 
  Card, 
  Typography, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField,
 } from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "../config/axios";
import PersonImg from "../assets/person-placeholder.jpeg";
import styled from "@emotion/styled";
import EditIcon from '@mui/icons-material/Edit';
import { CloudUpload } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useParams } from "react-router-dom";

const StyledImg = styled.img`
  border-radius: 50%;
  height: 100px;
  width: 100px;
  position: absolute;
  top: -60px;
  left: 42%;
  z-index: 2;,
  outline: 3px solid #fff;
  box-shadow: 7px 0px 7px 4px rgb(0,0,0,0.1);
  object-fit: cover;
`;

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function Profile() {
  const url = import.meta.env.VITE_API_URL;
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [model, setModel] = useState({
    first_name: "",
    last_name: "",
    email: "",
    about: "",
    image: null
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    axiosInstance(`${url}/users/${id}`)
    .then((res) => {
      setUser(res.data.data);
    })
  }, [url, id]);

  const openDialog = () => {
    axiosInstance(`${url}/users/`)
    .then((res) => {
      const data = res.data.data;
      setModel({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        about: data.about,
        image: data.image
      });
      setDialogOpen(true);
    })
  }

  const closeDialog = () => {
    setDialogOpen(false);
  }

  const handleInputChange = (e) => {
    switch(e.target.name) {
      case "first_name": 
        setModel({ ...model, first_name: e.target.value });
        break;
      case "last_name": 
        setModel({ ...model, last_name: e.target.value });
        break;
      case "email": 
        setModel({ ...model, email: e.target.value });
        break;
      case "about": 
        setModel({ ...model, about: e.target.value });
        break;
    }
  }

  const removeImage = () => {
    setModel({...model, image: null});
    if (previewUrl)
      setPreviewUrl(null);
  }

  const handleImageUpload = (e) => {
    setModel({...model, image: e.target.files[0]})
    setPreviewUrl(URL.createObjectURL(e.target.files[0]))
  }

  const fetchUser = () => {
    axiosInstance(`${url}/users/${id}`)
    .then((res) => {
      setUser(res.data.data);
    }).catch((err) => console.log(err))
  }

  const submitForm = () => {
    const formData = new FormData();

    for (const key in model) {
      formData.append(key, model[key])
    }
    setSaveLoading(true);
    axiosInstance.put(`${url}/users/${user._id}`, formData)
    .then((res) => {
      setPreviewUrl(null);
      setDialogOpen(false);
      fetchUser();
    }).catch((err) => {
      console.log(err);
    }).finally(() => setSaveLoading(false));
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", backgroundColor: "rgb(239 241 242)" }}>
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            sx={{ mt: 2 }} 
            name="first_name"
            label="First Name"
            value={model.first_name}
            required
            fullWidth
            onChange={handleInputChange}
          />
           <TextField
            sx={{ mt: 2 }} 
            name="last_name"
            label="Last Name"
            value={model.last_name}
            required
            fullWidth
            onChange={handleInputChange}
          />
          <TextField
            sx={{ mt: 2 }} 
            name="email"
            label="Email"
            type="email"
            value={model.email}
            required
            fullWidth
            onChange={handleInputChange}
          />
          <TextField
            sx={{ mt: 2 }} 
            name="about"
            label="About"
            value={model.about}
            fullWidth
            onChange={handleInputChange}
          />
          <Typography sx={{ mt: 2}}>Profile Picture *</Typography>
          {model.image || previewUrl ? (
            <Box sx={{ position: "relative", width: "325px" }}>
              <IconButton onClick={removeImage} sx={{ position: "absolute", right: "0", top: "0" }}><DeleteIcon sx={{ color: "red" }} /></IconButton>
              <img src={model.image.url || previewUrl} width="325" alt="" />
            </Box>
          ) : (<Button sx={{ mt: 1 }} component="label" variant="contained" tabIndex={-1} startIcon={<CloudUpload />}>
            Upload File
            <VisuallyHiddenInput type="file" onChange={handleImageUpload} />
            </Button>)}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={saveLoading}>Cancel</Button>
          <Button type="submit" onClick={submitForm} disabled={saveLoading}>Save</Button>
        </DialogActions>
      </Dialog>
      <Card sx={{ position: "relative", overflow: "visible", width: "42%", paddingTop: "44px", paddingBottom: "14px" }}>
        <StyledImg src={user && user.image ? user.image.url : PersonImg}></StyledImg>
        {user?.is_editable ? (
          <IconButton sx={{ position: "absolute", right: "5px", top: "5px"}} onClick={openDialog}><EditIcon /></IconButton>
        ) : null}
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4">{`${user?.first_name} ${user?.last_name}`}</Typography>
          <Typography variant="p">{user?.email}</Typography>
          <Typography sx={{ mt: 2, fontWeight: "bold"}}>About</Typography>
          <Typography>{ user?.about === "" || !user?.about ? "-" : user?.about }</Typography>
        </Box>
      </Card>
    </Box>
  )
}

export default Profile;