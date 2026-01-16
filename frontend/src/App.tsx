import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import Dashboard from './pages/Dashboard/Home';
import StoryList from './pages/Dashboard/StoryList';
import AddStory from './pages/Dashboard/AddStory';
import AddChapter from './pages/Dashboard/AddChapter';
import EditChapter from './pages/Dashboard/EditChapter';
import StoryDetail from './pages/Dashboard/StoryDetail';
import EditStory from './pages/Dashboard/EditStory';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="stories" element={<StoryList />} />
          <Route path="stories/add" element={<AddStory />} />
          <Route path="stories/:storyId/add-chapter" element={<AddChapter />} />
          <Route path="stories/:id" element={<StoryDetail />} />
          <Route path="stories/:id/edit" element={<EditStory />} />
          <Route path="stories/:storyId/chapters/:chapterId/edit" element={<EditChapter />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
