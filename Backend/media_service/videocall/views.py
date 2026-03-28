from django.shortcuts import render

from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from rest_framework import status
# Create your views here.
class Video_Call_View:
    pass

class Videoping(APIView):
    permission_classes = [AllowAny]
    def get(self,request):
        try:
            print("Ping !!")
            return Response({"message":"Ping"})
        except Exception as e:
            return Response({"message":"An error occurred"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    