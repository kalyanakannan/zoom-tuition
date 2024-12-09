from rest_framework import serializers
from .models import Meeting, Participant
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

class MeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meeting
        fields = '__all__'

class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = ['id', 'user', 'guest_name', 'meeting',  'peer_id', 'joined_at', 'is_active']

    def validate(self, data):
        # Ensure either 'user' or 'guest_name' is provided
        if not data.get('user') and not data.get('guest_name'):
            raise serializers.ValidationError("Either 'user' or 'guest_name' must be provided.")
        return data


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id','username', 'email', 'password']
        read_only_fields = ["id"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user
