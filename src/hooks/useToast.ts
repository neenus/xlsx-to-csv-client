import { useCallback } from "react";
import { ToastOptions, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const useToast = () => {

  const options: ToastOptions = {
    position: "top-right",
    autoClose: 6000,
    hideProgressBar: false,
    closeOnClick: true,
    rtl: false,
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true,
    theme: "colored",
  }

  const notify = useCallback(({ message, type }: NotifyParams) => toast[type](message, options), []);

  return { notify };
}

interface NotifyParams {
  message: string;
  type: "success" | "error" | "info" | "warn";
}

export default useToast;
