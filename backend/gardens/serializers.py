from rest_framework import serializers
from .models import Garden, GardenMembership, Invitation


class MemberSerializer(serializers.ModelSerializer):
    display_name = serializers.CharField(source='user.display_name')
    avatar_url = serializers.URLField(source='user.avatar_url')
    user_id = serializers.UUIDField(source='user.id')

    class Meta:
        model = GardenMembership
        fields = ['user_id', 'display_name', 'avatar_url', 'role', 'joined_at']


class GardenSerializer(serializers.ModelSerializer):
    member_count = serializers.SerializerMethodField()
    my_role = serializers.SerializerMethodField()
    type_display = serializers.CharField(source='get_type_display', read_only=True)

    class Meta:
        model = Garden
        fields = [
            'id', 'name', 'type', 'type_display', 'description',
            'image_url', 'privacy', 'member_count', 'my_role',
            'last_activity_at', 'created_at',
        ]
        read_only_fields = ['id', 'created_at', 'last_activity_at']

    def get_member_count(self, obj):
        return obj.memberships.count()

    def get_my_role(self, obj):
        request = self.context.get('request')
        if not request:
            return None
        membership = obj.memberships.filter(user=request.user).first()
        return membership.role if membership else None


class GardenCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Garden
        fields = ['name', 'type', 'description', 'image_url', 'privacy']

    def create(self, validated_data):
        user = self.context['request'].user
        garden = Garden.objects.create(owner=user, **validated_data)
        GardenMembership.objects.create(
            garden=garden, user=user, role=GardenMembership.ROLE_ADMIN
        )
        return garden


class InvitationSerializer(serializers.ModelSerializer):
    garden_name = serializers.CharField(source='garden.name', read_only=True)
    garden_type = serializers.CharField(source='garden.type', read_only=True)
    created_by_name = serializers.CharField(source='created_by.display_name', read_only=True)

    class Meta:
        model = Invitation
        fields = [
            'id', 'code', 'garden_name', 'garden_type',
            'created_by_name', 'expires_at', 'status', 'created_at',
        ]
        read_only_fields = fields
