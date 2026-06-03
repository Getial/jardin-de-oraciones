from django.urls import path
from .views import (
    GardenListCreateView, GardenDetailView,
    GardenMembersView, GardenLeaveView,
    GardenInviteView, JoinGardenView,
)
from seeds.views import GardenSeedListView

urlpatterns = [
    path('', GardenListCreateView.as_view(), name='garden-list-create'),
    path('<uuid:pk>/', GardenDetailView.as_view(), name='garden-detail'),
    path('<uuid:pk>/members/', GardenMembersView.as_view(), name='garden-members'),
    path('<uuid:pk>/leave/', GardenLeaveView.as_view(), name='garden-leave'),
    path('<uuid:pk>/invite/', GardenInviteView.as_view(), name='garden-invite'),
    path('<uuid:garden_id>/seeds/', GardenSeedListView.as_view(), name='garden-seeds'),
    path('join/', JoinGardenView.as_view(), name='garden-join'),
]
