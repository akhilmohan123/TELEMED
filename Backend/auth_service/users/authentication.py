import jwt
from django.conf import settings
from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
with open("C:/Users/user/Desktop/akhil/private.pem", "r") as f:
    private_key = f.read()
User = get_user_model()

class JWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        # auth_header = request.headers.get('Authorization')
        
        # if not auth_header:
        #     return None
        print("JWTAuthentication called")

        try:
            token = request.COOKIES.get('access_token')
            print("Extracted token:", token)
            if not token:
                return None
            payload = jwt.decode(token, private_key, algorithms=["RS256"])
           
            user = User.objects.get(id=payload['id'])
            print(user)
            return (user, token)
        except jwt.ExpiredSignatureError:
            return None
        except jwt.DecodeError:
            return None
        except Exception as e:
            return None
        except User.DoesNotExist:
            return None
