import { Bounce, toast } from 'react-toastify';


const notifyToast = (message, type = 'default') => {
    toast(message, {
        type: type,
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    });
}

export default notifyToast;