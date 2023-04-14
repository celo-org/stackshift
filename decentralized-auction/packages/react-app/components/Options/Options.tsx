import Menu from "@mui/material/Menu";
import { useState } from "react";

export default function Options({
  children,
  anchorEl,
  handleClose,
}: {
  children: React.ReactNode;
  anchorEl: any;
  handleClose: () => void;
}) {
  const open = Boolean(anchorEl);

  return (
    <Menu
      id="demo-positioned-menu"
      aria-labelledby="demo-positioned-button"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      PaperProps={{
        style: {
          marginTop: ".5em",
          marginRight: "500em",
          padding: ".5em",
          borderRadius: "10px",
          width: "12em",
          boxShadow:
            "rgb(0 0 0 / 20%) 0px 10px 15px -1px, rgb(0 0 0 / 11%) 0px 4px 6px -2px",
          fontFamily: `"Inter", sans-serif`,
        },
      }}
    >
      {children}
    </Menu>
  );
}
