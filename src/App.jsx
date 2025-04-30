import AppRouter from "./Routes/Router";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
  <>
  
  <AppRouter />
  <ToastContainer position="top-center" autoClose={3000} />

  </>
  )
}
