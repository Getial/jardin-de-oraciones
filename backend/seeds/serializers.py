from rest_framework import serializers
from .models import Seed, SeedInteraction, SeedEvent


class SeedEventSerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = SeedEvent
        fields = ['id', 'description', 'created_by_name', 'created_at']

    def get_created_by_name(self, obj):
        if obj.created_by:
            return obj.created_by.display_name or obj.created_by.email
        return 'Sistema'


class SeedSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_id = serializers.SerializerMethodField()
    has_prayed = serializers.SerializerMethodField()

    class Meta:
        model = Seed
        fields = [
            'id', 'garden', 'type', 'title', 'content',
            'privacy', 'state', 'pray_count',
            'author_id', 'author_name', 'has_prayed',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'pray_count', 'created_at', 'updated_at']

    def get_author_name(self, obj):
        return obj.author.display_name or obj.author.email

    def get_author_id(self, obj):
        return str(obj.author.id)

    def get_has_prayed(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return obj.interactions.filter(
            user=request.user, type=SeedInteraction.TYPE_PRAYED
        ).exists()


class SeedCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seed
        fields = ['garden', 'type', 'title', 'content', 'privacy']
