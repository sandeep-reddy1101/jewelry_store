import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import ProductsPage from './pages/Products/ProductsPage';
import InvoicesPage from './pages/Invoices/InvoicesPage';
import NewInvoicePage from './pages/Invoices/NewInvoicePage';
import './App.css';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<div>Dashboard</div>} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/categories" element={<div>Categories</div>} />
          <Route path="/vendors" element={<div>Vendors</div>} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/invoices/new" element={<NewInvoicePage />} />
          <Route path="/employees" element={<div>Employees</div>} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
