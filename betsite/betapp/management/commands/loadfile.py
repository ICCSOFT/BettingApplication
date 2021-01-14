from django.core.management.base import BaseCommand
import csv
from betapp.models import Match, Score
import os
# import betapp.scoreget
# import betapp.matchget
import djqscsv
import pandas as pd

class Command(BaseCommand):
    help = 'Creating model objects according the file path specified'

    def add_arguments(self, parser):
        pass
        # parser.add_argument('match_file', type=str, help="file path")

    
    def handle(self, *args, **options):
        match_file = '.././matches.csv'
        score_file = '.././score.csv'

        if not os.path.isfile(match_file):
            print('file1 not found!')
            return
        if not os.path.isfile(score_file):
            print('file2 not found!')
            return
        
        Match.objects.all().delete()
        with open(match_file, newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            print('working on it')
            for row in reader:
                match, created = Match.objects.update_or_create(
                    time =row['time'], match_name=row['match_name'],
                    home_code=row['home_code'], draw_code=row['draw_code'], away_code=row['away_code'])
            print('done working1')
        

        with open(score_file, newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            print('working on it')
            for row in reader:
                score, created = Score.objects.update_or_create(
                    match_name=row['match_name'],finish=row['finish'],
                    defaults={'time': row['time'],"home_score": row['home_score'], "away_score" : row['away_score'],}
                )
            print('done working2')

        qs =  Score.objects.all()
        with open('.././database.csv', 'wb') as csv_file:
            djqscsv.write_csv(qs, csv_file)

        df = pd.read_csv('.././database.csv')
        score = df.drop(['ID','home score','away score', 'finish', 'date','time'],axis=1)
        score.to_csv('.././database.csv', index=False, encoding='utf-8')
        
        df = pd.read_csv(score_file)
        scores = df.drop(['home_score','away_score', 'finish', 'time'],axis=1)
        scores.to_csv('.././newscore.csv', index=False, encoding='utf-8')

        with open('.././database.csv', 'r') as t1, open('.././newscore.csv', 'r') as t2:
            database = t1.readlines()
            newdata = t2.readlines()

        with open('.././update.csv', 'w') as outFile:
            for line in database:
                if line not in newdata:
                    outFile.write(line)

        

        with open('.././update.csv', newline='', encoding='utf-8') as g:
            reader = csv.DictReader(g)
            print('working on it3')
            for row in reader:
                score, created = Score.objects.update_or_create(
                    match_name=row['match name'],defaults={'finish': True}
                )
            print('done working3')

