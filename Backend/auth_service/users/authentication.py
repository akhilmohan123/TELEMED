import jwt
from rest_framework import authentication
from django.contrib.auth import get_user_model
import os

private_key = os.getenv("PRIVATE_KEY")
public_key = os.getenv("PUBLIC_KEY")

User = get_user_model()

class JWTAuthentication(authentication.BaseAuthentication):

    def authenticate(self, request):
        print("JWTAuthentication called")

        try:
            token = request.COOKIES.get("access_token")

            if not token:
                return None

            payload = jwt.decode(token, public_key, algorithms=["RS256"])

            user = User.objects.get(id=payload["id"])

            return (user, token)

        except jwt.ExpiredSignatureError:
            return None
        except jwt.DecodeError:
            return None
        except User.DoesNotExist:
            return None
        except Exception as e:
            print("Auth error:", e)
            return None