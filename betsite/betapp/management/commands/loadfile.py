from django.core.management.base import BaseCommand
import csv
from betapp.models import Match
import os
import betapp.skrap

class Command(BaseCommand):
    help = 'Creating model objects according the file path specified'

    def add_arguments(self, parser):
        pass
        # parser.add_argument('match_file', type=str, help="file path")


    def handle(self, *args, **options):
        match_file = '.././matches.csv'

        if not os.path.isfile(match_file):
            print('file not found!')
            return
            
        Match.objects.all().delete()
        with open(match_file, newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                match, created = Match.objects.update_or_create(
                    time =row['time'], match_name=row['match_name'],
                    home_code=row['home_code'], draw_code=row['draw_code'], away_code=row['away_code'])

