import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './modules/auth/Login';
import Dashboard from './modules/dashboard/Dashboard';
import MainLayout from './components/layout/MainLayout';
import InventoryView from './modules/inventory_erp/InventoryView';
import DirectoryView from './modules/directory/DirectoryView';
import SalesView from './modules/sales/SalesView';
import PurchaseView from './modules/purchases/PurchaseView';
import UsersView from './modules/users/UsersView';
import './App.css';

import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <NotificationProvider>
      <Router>
      <div className="App">
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/login" element={<Login />} />

          {/* Rutas Privadas (Protegidas por Layout) */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Nuevos Módulos del ERP */}
            <Route path="/inventory" element={<InventoryView />} />
            <Route path="/sales" element={<SalesView />} />
            <Route path="/purchases" element={<PurchaseView />} />
            <Route path="/clients" element={<DirectoryView />} />
            <Route path="/suppliers" element={<DirectoryView />} />
            <Route path="/users" element={<UsersView />} />
          </Route>

          {/* Redirecciones */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
     </Router>
    </NotificationProvider>
  );
}

export default App;
