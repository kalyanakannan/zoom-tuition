from django.urls import path
from .views import MeetingListCreateView, ParticipantListCreateView
from .views import UserRegistrationView

urlpatterns = [
    path('meetings/', MeetingListCreateView.as_view(), name='meeting-list-create'),
    path('participants/', ParticipantListCreateView.as_view(), name='participant-list-create'),
     path('register/', UserRegistrationView.as_view(), name='user-registration')
]
