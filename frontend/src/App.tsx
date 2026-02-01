import { Outlet } from 'react-router';
import Navbar from './components/navbar.tsx';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;
