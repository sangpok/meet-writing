import { AppLayout } from '@Layouts/AppLayout';
import { AllPostViewPage } from '@Pages/AllPostViewPage';
import { InitialSettingPage } from '@Pages/InitialSettingPage';
import { LoginPage } from '@Pages/LoginPage';
import { MyInfoEditPage } from '@Pages/MyInfoEditPage';
import { MyInfoPage } from '@Pages/MyInfoPage';
import { MyPostPage } from '@Pages/MyPostPage';
import { MyPostViewPage } from '@Pages/MyPostViewPage';
import { OnboardingPage, loader as onboardingLoader } from '@Pages/OnboardingPage';
import { PostEditPage } from '@Pages/PostEditPage';
import { PostWritePage } from '@Pages/PostWritePage';
import { ResignedPage } from '@Pages/ResignedPage';
import { SavedPostPage } from '@Pages/SavedPostPage';
import { SavedPostViewPage } from '@Pages/SavedPostViewPage';
import { SettingPage } from '@Pages/SettingPage';
import { SignupPage } from '@Pages/SignupPage';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute, loader as protectedLoader } from './ProtectedRoute';

export const routes: RouteObject[] = [
  {
    index: true,
    loader: onboardingLoader,
    element: <OnboardingPage />,
  },
  {
    path: 'signup',
    element: <SignupPage />,
  },
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    path: 'resigned',
    element: <ResignedPage />,
  },
  {
    loader: protectedLoader,
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'post/all',
        element: <AllPostViewPage />,
      },
      {
        path: 'post/write',
        element: <PostWritePage />,
      },
      {
        path: 'mypost',
        element: <MyPostPage />,
      },
      {
        path: 'mypost/view',
        element: <MyPostViewPage />,
      },
      {
        path: 'mypost/edit',
        element: <PostEditPage />,
      },
      {
        path: 'saved-post',
        element: <SavedPostPage />,
      },
      {
        path: 'saved-post/view',
        element: <SavedPostViewPage />,
      },
      {
        path: 'mypage',
        element: <MyInfoPage />,
      },
      {
        path: 'mypage/initial-edit',
        element: <InitialSettingPage />,
      },
      {
        path: 'mypage/edit',
        element: <MyInfoEditPage />,
      },
      {
        path: 'settings',
        element: <SettingPage />,
      },
    ],
  },
];
