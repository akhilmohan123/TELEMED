from django.urls import path
from .views import Video_Call_View,Videoping

urlpatterns=[
    path('videocall',Video_Call_View,name='videocall'),
    path('ping',Videoping,name='videocall'),
]