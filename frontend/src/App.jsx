import React, { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { BrowserRouter } from "react-router-dom";
import store from "./redux/store";
import { auth } from "./firebase/firebaseConfig";
import { setUser, logout } from "./redux/slices/userSlice";
import AppRoutes from "./routes/AppRoutes";
import { SocketProvider } from "./context/socket";
import { ToastContainer } from 'react-toastify';
import useSocketEvents from "./socket/useSocketEvents";

const AppContent = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  useSocketEvents();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser({ email: user.email, uid: user.uid }));
      } else {
        dispatch(logout());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (loading) return null;
  return <AppRoutes />;
};


function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <SocketProvider>
          <AppContent />

        </SocketProvider>
      </BrowserRouter>
      <ToastContainer />
    </Provider>
  );
}

export default App;
