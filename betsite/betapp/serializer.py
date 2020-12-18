from django.contrib.auth.models import User, Group
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from .models import *

class UserSerializer(serializers.HyperlinkedModelSerializer): 
    class Meta: 
        model = User 
        fields = ('id', 'username', 'email','password','phone', 'fullname', 'is_superuser' ) 
        extra_kwargs = {'password': {'write_only': True, 'required': True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class RegisterSerializer(serializers.HyperlinkedModelSerializer): 
    class Meta: 
        model = User 
        fields = ('id', 'username', 'email','password','phone', 'fullname') 
        extra_kwargs = {'password': {'write_only': True, 'required': True}}
        
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
        
class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ('id','time','match_name','home_code','draw_code', 'away_code')
        
class MatchMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ('id','time','match_name','home_code','draw_code', 'away_code')

class OrderSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ('customer_name', 'match','odd', 'stake_amount', 'possible_winning', 'date_ordered')

    def get_customer_name(self,obj):
        if obj.customer != None:
            return obj.customer.username

    def create(self, validated_data):
        # match=validated_data['match']
        # odd=validated_data['odd']
        # stake_amount=validated_data['stake_amount']
        # possible_winning=validated_data['possible_winning']
        # order_obj=Order.objects.create(
        #     match=match,
        #     odd = odd,
        #     stake_amount=stake_amount,
        #     possible_winning=possible_winning
        # )
        order_obj = super(OrderSerializer, self).create(validated_data)
        order_obj.customer=self.context['request'].user
        order_obj.save()
        return order_obj