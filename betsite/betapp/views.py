from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.response import Response
from .serializer import MatchSerializer, MatchMiniSerializer, OrderSerializer,UserSerializer,RegisterSerializer
from .models import *
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny

class MatchViewSet(viewsets.ModelViewSet):
    """ 
    API enddpoint that allows users to be viewed or edited. 
    """
    queryset = Match.objects.all()
    
    serializer_class = MatchSerializer
    permission_classes = (AllowAny,)

    def list(self, request, *args, **kwargs):
        matches = Match.objects.all().order_by('time')
        serializer = MatchMiniSerializer(matches, many=True)
        return Response(serializer.data)

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def list(self, request, *args, **kwargs):
        order = Order.objects.all()
        if 'username' in request.query_params:
            order=order.filter(customer__username=request.query_params['username'])
        serializer = OrderSerializer(order, many=True)
        return Response(serializer.data)

    def get_serializer_context(self):
        context = super(OrderViewSet, self).get_serializer_context()
        context.update({"request": self.request})
        return context

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    

class RegisterViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = RegisterSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (AllowAny,)

    def list(self, request, *args, **kwargs):
        userd = User.objects.all()
        if 'username' in request.query_params:
            userd=userd.filter(username=request.query_params['username'])
        serializer = UserSerializer(userd, many=True)
        return Response(serializer.data)