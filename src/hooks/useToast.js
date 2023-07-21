import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const useToast = () => {

  const options = {
    position: "top-right",
    autoClose: 6000,
    hideProgressBar: false,
    newestOnTop: true,
    closeOnClick: true,
    rtl: false,
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true,
    theme: "colored",
  }

  const notify = ({ message, type }) => toast[type](message, options);
  return { notify };
}

export default useToast;
