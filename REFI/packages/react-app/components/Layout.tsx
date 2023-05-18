import { FC, ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";

interface Props {
  children: ReactNode;
}
const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <div
        style={{ background: "#070A0E" }}
        className="flex flex-col min-h-screen"
      >
        <Header />
        <div className="">{children}</div>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
