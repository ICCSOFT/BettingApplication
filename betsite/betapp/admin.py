from django.contrib import admin
from .models import *
# Register your models here.

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    # fields = ("customer","match","odd","stake_amount","possible_winning","date_ordered")
    readonly_fields = ['date_ordered']
@admin.register(Score)
class ScoreAdmin(admin.ModelAdmin):
    readonly_fields = ['date']

admin.site.register(Match)
# admin.site.register(Score)
admin.site.register(User)
# admin.site.register(Order)
admin.site.register(Account)
admin.site.register(Transaction)
