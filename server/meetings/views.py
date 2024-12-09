from rest_framework import generics
from .models import Meeting, Participant
from .serializers import MeetingSerializer, ParticipantSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserRegistrationSerializer
from django.shortcuts import get_object_or_404


class MeetingListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        meetings = Meeting.objects.all()
        serializer = MeetingSerializer(meetings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data.copy()
        data["host"] = request.user.id

        serializer = MeetingSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ParticipantListCreateView(APIView):
    def get(self, request, meeting_id):
        try:
            meeting = Meeting.objects.get(id=meeting_id)
            participants = Participant.objects.filter(meeting=meeting)
            serializer = ParticipantSerializer(participants, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Meeting.DoesNotExist:
            return Response(
                {"error": "Meeting not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def post(self, request, meeting_id):
        try:
            meeting = Meeting.objects.get(id=meeting_id)
            data = request.data.copy()
            data["meeting"] = meeting.id

            serializer = ParticipantSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Meeting.DoesNotExist:
            return Response(
                {"error": "Meeting not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ParticipantJoinView(APIView):

    def post(self, request, meeting_id):
        meeting = get_object_or_404(Meeting, id=meeting_id)

        peer_id = request.data.get("peer_id")

        if not peer_id:
            return Response(
                {"error": "Peer ID is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        user = request.user

        if not request.user:
            user = request.data.get("guest_name")

        # Create or update participant
        participant, created = Participant.objects.get_or_create(
            meeting=meeting, user=user, defaults={"peer_id": peer_id, "is_active": True}
        )

        # Update peer_id if changed
        if participant.peer_id != peer_id:
            participant.peer_id = peer_id
            participant.save()

        other_participants = Participant.objects.filter(
            meeting=meeting, is_active=True
        ).exclude(user=user)

        return Response(
            {
                "message": "Joined successfully",
                "participants": [
                    {"user_id": p.user.id, "peer_id": p.peer_id}
                    for p in other_participants
                ],
            },
            status=status.HTTP_200_OK,
        )


class UserRegistrationView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User registered successfully!"},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
