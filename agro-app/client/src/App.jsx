import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './app/store';
import Layout from './components/Layout/Layout';
import AppRoutes from './routes/AppRoutes';
import PersistAuth from './features/auth/PersistAuth';
import CustomToaster from './components/Common/Toaster';

function App() {
  return (
    <Provider store={store}>
      <PersistAuth>
        <BrowserRouter>
          <Layout>
            <AppRoutes />
            <CustomToaster />
          </Layout>
        </BrowserRouter>
      </PersistAuth>
    </Provider>
  );
}

export default App;
