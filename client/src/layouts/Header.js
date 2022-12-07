import React from 'react';

import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { isFunc } from '../utils/utils';


export default function Header({pages,handleNavMenu, selectedTemplate, activeStep, buttonFunctions}) {
    const {goApprovStep, goProgressStep, goFirewallApprovStep, goFirewallReviewerStep, goFirewallStep } = buttonFunctions
    return(
        <AppBar
        position="static"
        style={{ background: "#FFB400", width: "1070px" }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              GO LOGIN
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page, index) => (
                  <MenuItem key={page} onClick={console.log("home button")}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />

            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page, index) => (
                <Button
                  key={page}
                  onClick={handleNavMenu.bind(this)}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page}
                </Button>
              ))}
            </Box>
            {
            pages.includes('요청하기') && 
            (Number(selectedTemplate || "99") === 1 ||
              Number(selectedTemplate || "99") === 99) &&
            activeStep === 0
              ? isFunc(goApprovStep) && goApprovStep()
              : isFunc(goProgressStep)  && goProgressStep()
            }
            {
            pages.includes('요청하기') && 
            Number(selectedTemplate || "99") === 2 && activeStep === 0
              ? isFunc(goFirewallApprovStep) && goFirewallApprovStep()
              : activeStep === 1
              ? isFunc(goFirewallReviewerStep) && goFirewallReviewerStep()
              : isFunc(goFirewallStep) && goFirewallStep()
              }
            
          </Toolbar>
        </Container>
      </AppBar>
    )
}