import React, { useState } from "react";
import "../layouts/style.css";
import {
  AppBar,
  Toolbar,
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  CssBaseline,
  Drawer,
  Typography
} from "@material-ui/core";
import AssignmentIcon from '@mui/icons-material/Assignment';
import {
  Apps,
  Menu,
  ContactMail,
  AssignmentInd,
  Home
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  menuSliderContainer: {
    width: 250,
    background: "#3f51b5",
    height: "100%"
  },
  avatar: {
    margin: "0.5rem auto",
    padding: "1rem",
    width: theme.spacing(13),
    height: theme.spacing(13)
  },
  listItem: { color: "white" }
}));

const listItems = [
  {
    listIcon: <Home />,
    listText: "요청"
  },
  {
    listIcon: <AssignmentInd />,
    listText: "요청목록"
  },
//   {
//     listIcon: <Apps />,
//     listText: "Portfolio"
//   },
//   {
//     listIcon: <ContactMail />,
//     listText: "Contacts"
//   }
];

export function WorkRequest() {
  const classes = useStyles();
  // 페이지 접근 시 사이드바 열려있을 수 있도록 수정
  const [open, setOpen] = useState(true);

  const toggleSlider = () => {
    setOpen(!open);
  };

  const sideList = () => (
    <Box className={classes.menuSliderContainer} component="div">
      <Avatar
        className={classes.avatar}
        src={AssignmentIcon}
        alt="leejaemoon"
      />
      <Divider />
      <List>
        {listItems.map((listItem, index) => (
          <ListItem className={classes.listItem} button key={index}>
            <ListItemIcon className={classes.listItem}>
              {listItem.listIcon}
            </ListItemIcon>
            <ListItemText primary={listItem.listText} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <CssBaseline />

      <Box component="nav">
        <AppBar position="static">
          <Toolbar>
            <IconButton onClick={toggleSlider}>
              <Menu />
            </IconButton>
            <Typography>카카오페이 업무요청</Typography>
            <Drawer 
                open={open} 
                anchor="left" 
                onClose={toggleSlider}
            > {sideList()}
            </Drawer>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}
