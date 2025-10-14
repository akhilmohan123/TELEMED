
from django.urls import path

from .token_generation import RefreshTokenView
from . views import ForgotPasswordView, RegistrationView,LoginView, ResetPasswordView,UserView,LogoutView
urlpatterns = [
   path('register',RegistrationView.as_view(),name='register'),
   path('login',LoginView.as_view(),name='login'),
   path('user',UserView.as_view(),name='user'),
   path('logout',LogoutView.as_view(),name='logout'),
   path('refresh',RefreshTokenView.as_view(),name='refresh'),
   path('reset-password/<str:token>',ResetPasswordView.as_view(),name='reset-password'),
   path('forgot_password',ForgotPasswordView.as_view(),name='forgot_password'),
  
]