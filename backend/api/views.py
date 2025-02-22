from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny


# Create your views here.
class CreateUserView(generics.CreateAPIView):
    # Check all the objects before creating a User, avoid creating an User that already exists
    queryset = User.objects.all()
    # Tells the view the class need to be use to create a user
    serializer_class = UserSerializer
    # Who can actually call this to create a new user
    permission_classes = [AllowAny]
