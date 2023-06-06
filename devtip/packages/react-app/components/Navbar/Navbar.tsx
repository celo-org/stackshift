import React, { useEffect, useState } from "react";
import styles from "./Navbar.module.scss";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { RiGithubFill } from "react-icons/ri";
import {
  getAuth,
  signInWithPopup,
  GithubAuthProvider,
  signOut,
  setPersistence,
  browserLocalPersistence,
  User,
} from "firebase/auth";
import { app } from "@/firebase";
import Link from "next/link";

export interface CustomUser extends User {
  accessToken?: string;
  reloadUserInfo?: {
    screenName: string;
  };
}

function Navbar({ filled }: { filled?: boolean }) {
  const [userAccessToken, setUserAccessToken] = useState<string | undefined>(
    ""
  );
  const auth = getAuth(app);
  (async () => {
    await setPersistence(auth, browserLocalPersistence);
  })();
  const user: CustomUser | null = auth.currentUser;
  const provider = new GithubAuthProvider();

  const loginLogout = async () => {
    if (user && user.accessToken) {
      await signOut(auth);
      setUserAccessToken("");
    } else {
      signInWithPopup(auth, provider)
        .then(async (result) => {
          const user: CustomUser = result.user;
          setUserAccessToken(user.accessToken);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    if (user?.accessToken) {
      setUserAccessToken(user.accessToken);
    }
    auth.onAuthStateChanged((user: CustomUser | null) => {
      if (user && user.accessToken) {
        setUserAccessToken(user.accessToken);
      }
    });
  }, []);

  return (
    <nav className={filled ? styles.NavbarFilled : styles.Navbar}>
      <h3>
        <Link href="/">DevTip</Link>
      </h3>
      <div className={styles.Links}>
        <button className={styles.githubAuth} onClick={loginLogout}>
          <RiGithubFill size={25} fill="#fff" />
          <span>{userAccessToken ? "Logout" : "Login"}</span>
        </button>
        <ConnectButton chainStatus={"none"} showBalance={false} />
      </div>
    </nav>
  );
}

export default Navbar;
