import './App.css';

import TagSearchPage from './components/manualLabeling/TagSearchPage';
import MainLayout from './layout/MainLayout';

import { Routing } from './routes/Routing';

function App() {

  return (
        <MainLayout>
      <Routing />
    </MainLayout>

  );

}

export default App;