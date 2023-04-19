import toast from "react-hot-toast";

export const notify = (type: "success" | "error", message: string) =>
  toast[type](message, {
    style: {
      border: "1px solid #35d075",
      padding: "10px",
      color: "#000",
      background: "#ffffff",
    },
    iconTheme: {
      primary: "#35d075",
      secondary: "#FFFAEE",
    },
    duration: 3000,
  });
