import toast from "react-hot-toast";

export const notify = (type: "success" | "error", message: string) =>
  toast[type](message, {
    style: {
      border: "1px solid #476520",
      padding: "10px",
      color: "#000",
      background: "#ffffff",
    },
    iconTheme: {
      primary: "#476520",
      secondary: "#FFFAEE",
    },
    duration: 3000,
  });
