#Import Selenium
from selenium import webdriver
import pandas as pd

#Writing our First Selenium Python Test
web = 'https://sports.tipico.de/en/todays-matches'
path = '../././chromedriver_linux64/chromedriver'
driver = webdriver.Chrome(path)
driver.get(web)

#Make ChromeDriver click a button
accept = driver.find_element_by_xpath('//*[@id="_evidon-accept-button"]')
accept.click()

#Initialize your storage
time = []
teams = []
odd = [] #3-way
odds_events = []

#Looking for 'sports titles'
sport_title = driver.find_elements_by_class_name('SportTitle-styles-sport')

for sport in sport_title:
    # selecting only football
    if sport.text == 'Football':
        parent = sport.find_element_by_xpath('./..') #immediate parent node
        grandparent = parent.find_element_by_xpath('./..') #grandparent node = the whole 'football' section
        #Looking for single row events
        single_row_events = grandparent.find_elements_by_class_name('EventRow-styles-event-row')
        #Getting data
        for match in single_row_events:
            #'odd_events'
            odds_event = match.find_elements_by_class_name('EventOddGroup-styles-odd-groups')
            odds_events.append(odds_event)
            # Team names
            for team in match.find_elements_by_class_name('EventTeams-styles-titles'):
                teams.append(team.text)
            # Temes time
            for tim in match.find_elements_by_class_name('EventDateTime-styles-time'):
                time.append(tim.text)

        #Getting data: the odds        
        for odds_event in odds_events:
            for n, box in enumerate(odds_event):
                rows = box.find_elements_by_xpath('.//*')
                if n == 0:
                    odd.append(rows[0].text)

driver.quit()
#Storing lists within dictionary
dict_gambling = {'time':time,'match_name': teams, 'odd': odd}
#Presenting data in dataframe
df_gambling = pd.DataFrame.from_dict(dict_gambling)
df_gambling.to_csv('bet.csv', index=False, encoding='utf-8')

df = pd.read_csv('.././bet.csv')
df['match_name'] = [" vs ".join(s.split('\n'))  for s in df.match_name]
gh = [s.split('\n')  for s in df['odd']]
df['home_code'] = [row[0] for row in gh]
df['draw_code'] = [row[1] for row in gh]
df['away_code'] = [row[-1] for row in gh]
matches = df.drop('odd',axis=1)

matches.to_csv('.././matches.csv', index=False, encoding='utf-8')