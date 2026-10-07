// client/src/App.jsx
import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { AddStaffPage } from "./pages/AddStaffPage.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { DashboardLayout } from "./components/layout/DashboardLayout.jsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/staff" element={<AddStaffPage />} />
      </Route>
    </Routes>
  );
}
export default App;