#Import Selenium
from selenium import webdriver
import pandas as pd

#Writing our First Selenium Python Test
web = 'https://sports.tipico.de/en/live/soccer'
path = '../././chromedriver_linux64/chromedriver'
driver = webdriver.Chrome(path)
driver.get(web)

#Make ChromeDriver click a button
try:
    accept = driver.find_element_by_xpath('//*[@id="_evidon-accept-button"]')
    accept.click()
except:
    pass

#Initialize your storage
time = []
teams = []
home_score = []
away_score = []
odds_events = []
finish = []

#Looking for 'sports titles'
sport_title = driver.find_elements_by_class_name('Live-styles-live-program')
grandparent = sport_title[0].find_elements_by_class_name('Program-styles-program')

parent = grandparent[0].find_elements_by_class_name('Sport-styles-sport-container')

single_row_events = parent[0].find_elements_by_class_name('EventRow-styles-event-row')
for match in single_row_events:
    #'odd_events'
    odds_event = match.find_elements_by_class_name('EventScores-styles-scores')
    odds_events.append(odds_event)
    # Team names
    for team in match.find_elements_by_class_name('EventTeams-styles-titles'):
        teams.append(team.text)
    # Temes time
    for tim in match.find_elements_by_class_name('EventDateTime-styles-info-cell-live'):
        time.append(tim.text)

# Getting data: the odds        
for odds_event in odds_events:
    for n, box in enumerate(odds_event):
        rows = box.find_elements_by_xpath('.//*')
        # print(rows)
        if n == 0:
            home_score.append(rows[-1].text)
            away_score.append(rows[-2].text)
            finish.append(False)

driver.quit()

#Storing lists within dictionary
dict_gambling = {'time':time,'match_name': teams, 'home_score': home_score, 'away_score':away_score, 'finish':finish}
#Presenting data in dataframe
print(dict_gambling)
df = pd.DataFrame.from_dict(dict_gambling)
df['match_name'] = [" vs ".join(s.split('\n'))  for s in df.match_name]
df['time'] = [" vs ".join(s.split(' '))  for s in df.time]
df.to_csv('.././score.csv', index=False, encoding='utf-8')