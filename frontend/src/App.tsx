import { Outlet } from "react-router";
import Navbar from "./components/navbar.tsx";

function App() {
  return (
      <>
        <Navbar />
        <main style={{ padding: "1rem" }}>
          <Outlet />
        </main>
      </>
  );
}

export default App;