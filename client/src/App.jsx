// client/src/App.jsx
import { Navigate, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AddStaffPage } from "./pages/AddStaffPage";
import { OrganizationsPage } from "./pages/OrganizationsPage";
import { OrganizationFormPage } from "./pages/OrganizationFormPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { OrganizationDetailPage } from "./pages/OrganizationDetailPage.jsx";
import { TasksPage } from "./pages/TasksPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { WorkspaceModulePage } from "./pages/WorkspaceModulePage";
import { IssuesPage } from "./pages/IssuesPage";
function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/feed" element={<WorkspaceModulePage title="Feed" />} />
        <Route path="/discuss" element={<WorkspaceModulePage title="Discuss" />} />
        <Route path="/reports" element={<WorkspaceModulePage title="Report" />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/work-overview" element={<Navigate to="/work-overview/tasks" replace />} />
        <Route path="/work-overview/tasks" element={<TasksPage />} />
        <Route path="/work-overview/issues" element={<IssuesPage />} />
        <Route path="/work-overview/milestones" element={<WorkspaceModulePage title="Milestones" />} />
        <Route path="/work-overview/timesheets" element={<WorkspaceModulePage title="Timesheets" />} />
        <Route path="/calendar" element={<WorkspaceModulePage title="Calendar" />} />
        <Route path="/tasks" element={<Navigate to="/work-overview/tasks" replace />} />
        <Route path="/organizations" element={<OrganizationsPage />} />
        <Route path="/organizations/new" element={<OrganizationFormPage />} />
        <Route path="/organizations/:id" element={<OrganizationDetailPage />} />
        <Route path="/staff" element={<AddStaffPage />} />
      </Route>
    </Routes>
  );
}

export default App;
