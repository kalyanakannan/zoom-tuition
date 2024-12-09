from django.urls import path
from .views import MeetingListCreateView, ParticipantListCreateView, ParticipantJoinView
from .views import UserRegistrationView

urlpatterns = [
    path('meetings/', MeetingListCreateView.as_view(), name='meeting-list-create'),
    path("participants/<str:meeting_id>/", ParticipantListCreateView.as_view(), name='participant-list'),
    path('meetings/<str:meeting_id>/join/', ParticipantJoinView.as_view(), name='meeting-join'),
     path('register/', UserRegistrationView.as_view(), name='user-registration')
]
