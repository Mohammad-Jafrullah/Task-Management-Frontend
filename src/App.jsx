import { BrowserRouter } from "react-router-dom";
import Authentication from "./components/authentication/Authentication";
import { useContext } from "react";
import { GlobalContext } from "./components/context/Store";
import Dashboard from "./components/dashboard/Dashboard";

export default function App() {

  const { AUTHTOKEN } = useContext(GlobalContext);

  const renderComponent = () => {
    if (AUTHTOKEN) {
      return <Dashboard />
    }
    return <Authentication />
  }

  return (
    <>
      <BrowserRouter>
        {renderComponent()}
      </BrowserRouter>
    </>
  )
}