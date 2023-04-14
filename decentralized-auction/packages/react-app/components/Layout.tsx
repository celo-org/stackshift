import { FC, ReactNode } from "react";
import Header from "./Header";
import { Box } from "@mui/material";

interface Props {
  children: ReactNode;
}
const Layout: FC<Props> = ({ children }) => {
  return (
    <Box display={"flex"} flexDirection={"column"} height={"100vh"}>
      <Header />
      <Box flex={1} display={"flex"} overflow={"auto"}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
