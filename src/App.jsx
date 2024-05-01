import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import router from "./routes/index";
import "./App.css";

const App = () => {

  return (
    <div className="app">
      <ToastContainer position="top-right" />
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
