import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useDisconnect } from "wagmi";
import { useRouter } from "next/router";
import MenuItem from "@mui/material/MenuItem";

import styles from "./CustomConnectBtn.module.scss";
import Options from "../Options/Options";
import { Avatar, Button } from "@mui/material";
import styled from "@emotion/styled";

export const CustomButton = styled(Button)({
  color: "#fff",
  backgroundColor: "#005ce6",
  textTransform: "capitalize",
  fontFamily: "inherit !important",
});

export default function CustomConnectBtn() {
  const { disconnectAsync } = useDisconnect();
  const { push } = useRouter();
  const [anchorEl, setAnchorEl] = useState<
    (EventTarget & HTMLDivElement) | null
  >(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const shortenAddress = (add: string) =>
    !!add
      ? (
          add.slice(0, 5) +
          "..." +
          add.slice(add.length - 4, add.length)
        ).toLowerCase()
      : "";

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <CustomButton
                    size="medium"
                    variant="contained"
                    onClick={openConnectModal}
                  >
                    Sign In
                  </CustomButton>
                );
              }
              return (
                <div>
                  <div
                    aria-controls={open ? "demo-positioned-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                    style={{ cursor: "pointer" }}
                  >
                    <Avatar
                      style={{
                        background: "#005ce6",
                        color: "#fff",
                      }}
                      alt="Qudusayo"
                    />
                  </div>
                  <Options anchorEl={anchorEl} handleClose={handleClose}>
                    <MenuItem className={styles.Menu} disableRipple={true}>
                      <div>
                        <span
                          style={{
                            display: "block",
                            color: "rgba(4, 4, 5, 0.45)",
                          }}
                        >
                          Mainnet
                        </span>
                        <span style={{ display: "block" }}>
                          {shortenAddress(account.address)}
                        </span>
                      </div>
                    </MenuItem>
                    <MenuItem
                      className={styles.Menu}
                      onClick={() => push("/user")}
                    >
                      My items
                    </MenuItem>
                    <MenuItem
                      className={styles.Menu}
                      onClick={() => {
                        handleClose();
                        disconnectAsync();
                      }}
                    >
                      Disconnect
                    </MenuItem>
                  </Options>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
