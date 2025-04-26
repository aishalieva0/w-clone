import React, { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./redux/store";
import AppRoutes from "./routes/AppRoutes";
import { SocketProvider } from "./context/socket";
import { ToastContainer } from "react-toastify";
import useSocketEvents from "./socket/useSocketEvents";
import { handleLogin, listenForAuthChanges } from "./firebase/auth";

const AppContent = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  useSocketEvents();

  useEffect(() => {
    handleLogin(dispatch);

    listenForAuthChanges(dispatch);
  }, [dispatch]);

  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      const finalTheme = theme === "default" ? systemTheme : theme;

      root.className = finalTheme;
    };

    applyTheme();
  }, [theme]);

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
