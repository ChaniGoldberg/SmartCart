import './App.css';

import MainLayout from './layout/MainLayout';

import { Routing } from './routes/Routing';
import { UserProvider } from './store/redux/userContext';
import { StoreProvider } from './store/storage/StoreProvider';

function App() {

  return (
      <StoreProvider>
    <UserProvider>
        <MainLayout>
      <Routing />
    </MainLayout>
    </UserProvider>
    </StoreProvider>

  );

}

export default App;