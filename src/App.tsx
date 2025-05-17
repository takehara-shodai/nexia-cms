import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ModalProvider } from '@/contexts/ModalContext';
import Layout from '@/components/layout/Layout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import ContentList from '@/pages/ContentList';
import ContentDetail from '@/pages/ContentDetail';
import ContentModels from '@/pages/ContentModels';
import FieldSettings from '@/pages/FieldSettings';
import RelationSettings from '@/pages/RelationSettings';
import ValidationRules from '@/pages/ValidationRules';
import ComponentManagement from '@/pages/ComponentManagement';
import ApiManagement from '@/pages/ApiManagement';
import WebsiteManagement from '@/pages/WebsiteManagement';
import WorkflowManagement from '@/pages/WorkflowManagement';
import MediaManagement from '@/pages/MediaManagement';
import IntegrationsManagement from '@/pages/IntegrationsManagement';
import AnalyticsManagement from '@/pages/AnalyticsManagement';
import SettingsManagement from '@/pages/SettingsManagement';
import LocalizationManagement from '@/pages/LocalizationManagement';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <ModalProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="content" element={<ContentList />} />
              <Route path="content/:id" element={<ContentDetail />} />
              <Route path="models" element={<ContentModels />} />
              <Route path="models/fields" element={<FieldSettings />} />
              <Route path="models/relations" element={<RelationSettings />} />
              <Route path="models/validation" element={<ValidationRules />} />
              <Route path="models/components" element={<ComponentManagement />} />
              <Route path="api" element={<ApiManagement />} />
              <Route path="website" element={<WebsiteManagement />} />
              <Route path="workflow" element={<WorkflowManagement />} />
              <Route path="media" element={<MediaManagement />} />
              <Route path="integrations" element={<IntegrationsManagement />} />
              <Route path="analytics" element={<AnalyticsManagement />} />
              <Route path="settings" element={<SettingsManagement />} />
              <Route path="localization" element={<LocalizationManagement />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ModalProvider>
    </ThemeProvider>
  );
}

export default App;