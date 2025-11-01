import jwt
from django.conf import settings
from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
with open("C:/Users/user/Desktop/akhil/public.pem", "r") as f:
    public_key = f.read()
User = get_user_model()
class AuthServiceUser:
    """
    Represents a user from auth service for DRF
    """
    def __init__(self, id, email):
        self.id = id
        self.email = email

    @property
    def is_authenticated(self):
        return True
class JWTAuthentication(authentication.BaseAuthentication):
    
    def authenticate(self, request):
        # auth_header = request.headers.get('Authorization')
        
        # if not auth_header:
        #     return None
        print("JWTAuthentication called")

        try:
            print("cookies are ",request.COOKIES)
            token = request.COOKIES.get('access_token')
            print("Extracted token:", token)
            if not token:
                return None
            payload = jwt.decode(token, public_key, algorithms=["RS256"])
            print(payload)
            id=payload.get("id")
            email=payload.get("email")
            user = AuthServiceUser(id, email)
            return (user, token)
        except jwt.ExpiredSignatureError:
            print(" Token expired")
            raise AuthenticationFailed("Token expired")
        except jwt.DecodeError:
            print(" Invalid token")
            raise AuthenticationFailed("Invalid token")
        except Exception as e:
            print("Error decoding token:", e)
            raise AuthenticationFailed("Invalid token")