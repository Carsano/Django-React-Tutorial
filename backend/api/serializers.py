from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        # Tells Django that we only write password when creating new user but no possibility to read the password
        extra_kwargs = {"password": {"write_only": True}}

    # Validated data will be already be validated by the serializers.ModelSerializer
    def create(self, validated_data) -> User:
        user = User.objects.create_user(**validated_data)
        return user


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}
