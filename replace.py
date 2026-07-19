import sys

file_path = 'src/app/page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    'Achieve Your Dreams with Coaching that Delivers Results!': 'Build your Web3 Fan Identity and Predict World Cup Matches!',
    'Since': 'Join',
    '2015,': 'Today,',
    'Elevare': 'Passport',
    'helped': 'united',
    'athletes': 'football fans',
    'elevate': 'build',
    'their': 'their',
    'performance.': 'reputation.',
    'Athletes Trained Since 2010': 'Active Fans on Solana',
    'reach': 'earn',
    'athletic': 'exclusive',
    'goal.': 'rewards.',
    'Satisfaction Rate': 'Transactions',
    'Almost all of our participants report significant ': 'Powered by Solana for instant settlement ',
    'Professinal Experience': 'World Cup Teams',
    'Our team consists of seasoned professional with extensive ': 'Predict matches and earn unique NFT rewards ',
    'Programs': 'Predictions',
    'Coaches': 'Reputation',
    'Nutrition': 'NFTs',
    'Support': 'Community',
    'Community': 'Leaderboard',
    'Why': 'Why',
    'great': 'Web3',
    'coaching': 'identity',
    'changes': 'changes',
    'everything': 'everything',
    'At Elevare, we recognize that every individual is unique. That’s why we design personalized programs tailored to your abilities, schedule, and goals': 'We empower fans to own their data and earn rewards based on their passion. Create your Fan Passport today.',
    'We deliver training programs tailored to each participant’s unique needs and goals.': 'A revolutionary way to interact with the FIFA World Cup.',
    'Olivia Grant,': 'Satoshi,',
    'Football Coach': 'Top Fan',
    'Choose': 'Mint',
    'sport,': 'passport,',
    'Program': 'Passport',
    'Running': 'Minting',
    'Develop elite basketball skills, confidence, and game intelligence through structured,': 'Claim your unique digital identity and join the global fan community on-chain.',
    '10k+ Athletes Review': '10k+ Fans Connected',
    'What': 'What',
    'our': 'our',
    'say': 'say',
    'about': 'about',
    'experience': 'experience',
    'results': 'rewards',
    'they’ve': 'they’ve',
    'achieved': 'earned',
    '“As a beginner, I was nervous about starting a structured sports program. Elevare made the process smooth and encouraging. The step-by-step guidance, supportive community,”': '“I love predicting matches and earning NFTs! The Fan Passport has completely changed how I watch the World Cup. The community is amazing and the rewards are real.”',
    'Competitive Athlete': 'Top Predictor'
}

for old, new in replacements.items():
    content = content.replace(old, new)

# Special replace for "Sports" because it might match "sports" in class names if not careful, but it's capitalized here.
content = content.replace('>Sports<', '>Fan Pass<')
content = content.replace('>\n                      Sports\n                    <', '>\n                      Fan Pass\n                    <')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Replacements done.')
