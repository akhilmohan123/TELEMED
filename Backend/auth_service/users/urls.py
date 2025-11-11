
from django.urls import path

from .token_generation import RefreshTokenView
from . views import ForgotPasswordView, PublicUserView, RegistrationView,LoginView, ResetPasswordView,UserView,LogoutView,Getuserview,Checkschemaview
urlpatterns = [
   path('api/register',RegistrationView.as_view(),name='register'),
   path('api/login',LoginView.as_view(),name='login'),
   path('api/user',UserView.as_view(),name='user'),
   path('api/logout',LogoutView.as_view(),name='logout'),
   path('api/refresh',RefreshTokenView.as_view(),name='refresh'),
   path('api/reset-password/<str:token>',ResetPasswordView.as_view(),name='reset-password'),
   path('api/forgot_password',ForgotPasswordView.as_view(),name='forgot_password'),
   path('api/users',PublicUserView.as_view(),name='public-user'),
   path('api/get-user/<str:user_id>',Getuserview.as_view(),name='get-user'),
   path('api/test',Checkschemaview.as_view(),name='test')
  
]