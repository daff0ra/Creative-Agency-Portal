// client/src/App.jsx
import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AddStaffPage } from "./pages/AddStaffPage";
import { OrganizationsPage } from "./pages/OrganizationsPage";
import { OrganizationFormPage } from "./pages/OrganizationFormPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { OrganizationDetailPage } from "./pages/OrganizationDetailPage.jsx";
function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/organizations" element={<OrganizationsPage />} />
        <Route path="/organizations/new" element={<OrganizationFormPage />} />
        <Route path="/organizations/:id" element={<OrganizationDetailPage />} />
        <Route path="/staff" element={<AddStaffPage />} />
      </Route>
    </Routes>
  );
}

export default App;