import './App.css';

import MainLayout from './layout/MainLayout';

import { Routing } from './routes/Routing';
import { UserProvider } from './store/redux/userContext';

function App() {

  return (
    <UserProvider>
        <MainLayout>
      <Routing />
    </MainLayout>
    </UserProvider>

  );

}

export default App;