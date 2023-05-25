import { FC, ReactNode } from "react";
import Header from "./Header";

interface Props {
  children: ReactNode;
}
const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <div>
        <Header />
        <div>{children}</div>
      </div>
    </>
  );
};

export default Layout;
