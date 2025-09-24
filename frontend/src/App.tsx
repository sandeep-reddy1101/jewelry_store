import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import ProductsPage from './pages/Products/ProductsPage';
import VendorsPage from './pages/Vendors/VendorsPage';
import CategoriesPage from './pages/Categories/CategoriesPage';
import InvoicesPage from './pages/Invoices/InvoicesPage';
import NewInvoicePage from './pages/Invoices/NewInvoicePage';
import AnalyticsPageWrapper from './pages/Analytics';
import './App.css';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/vendors" element={<VendorsPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/invoices/new" element={<NewInvoicePage />} />
          <Route path="/employees" element={<div>Employees</div>} />
          <Route path="/analytics" element={<AnalyticsPageWrapper />} />
          <Route path="/settings" element={<div>Settings</div>} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
