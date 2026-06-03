from django.urls import path
from .views import SeedListCreateView, SeedDetailView, SeedPrayView, SeedAnswerView

urlpatterns = [
    path('', SeedListCreateView.as_view()),
    path('<uuid:pk>/', SeedDetailView.as_view()),
    path('<uuid:pk>/pray/', SeedPrayView.as_view()),
    path('<uuid:pk>/answer/', SeedAnswerView.as_view()),
]
