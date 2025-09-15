import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import DiseaseDetection from '../pages/DiseaseDetection';
import Suggestions from '../pages/Suggestion';

import ProtectedRoute from './ProtectedRoute';
import TrendingNews from '../pages/TrendingNews/TrendingNews';
import CommunityChat from '../pages/CommunityChat';
import VoiceChatbot from '../pages/VoiceChatbot';

export default function AppRoutes() {
  const user = useSelector((state) => state.auth.user);
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/disease-detection"
        element={
          <ProtectedRoute>
            <DiseaseDetection />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/suggestions"
        element={
          <ProtectedRoute>
            <Suggestions />
          </ProtectedRoute>
        }
      />
            <Route
        path="/trending-news"
        element={
          <ProtectedRoute>
             <TrendingNews/>
          </ProtectedRoute>
        }
      />
      <Route 
  path="/community" 
  element={
    <ProtectedRoute>
      <CommunityChat />
    </ProtectedRoute>
  } 
/>

      <Route 
  path="/voice-chat" 
  element={
    <ProtectedRoute>
      <VoiceChatbot />
    </ProtectedRoute>
  } 
/>
    </Routes>
  );
}