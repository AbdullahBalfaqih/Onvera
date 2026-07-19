import axios from 'axios';

const COUNTRY_CODES: Record<string, string> = {
  "Qatar": "QA", "Ecuador": "EC", "Senegal": "SN", "Netherlands": "NL",
  "England": "GB-ENG", "Iran": "IR", "USA": "US", "Wales": "GB-WLS",
  "Argentina": "AR", "Saudi Arabia": "SA", "Mexico": "MX", "Poland": "PL",
  "France": "FR", "Australia": "AU", "Denmark": "DK", "Tunisia": "TN",
  "Spain": "ES", "Costa Rica": "CR", "Germany": "DE", "Japan": "JP",
  "Belgium": "BE", "Canada": "CA", "Morocco": "MA", "Croatia": "HR",
  "Brazil": "BR", "Serbia": "RS", "Switzerland": "CH", "Cameroon": "CM",
  "Portugal": "PT", "Ghana": "GH", "Uruguay": "UY", "South Korea": "KR"
};

const STADIUMS_2026 = [
  "MetLife Stadium, New York", "AT&T Stadium, Dallas", "Arrowhead Stadium, Kansas City",
  "NRG Stadium, Houston", "Mercedes-Benz Stadium, Atlanta", "SoFi Stadium, Los Angeles",
  "Lincoln Financial Field, Philadelphia", "Lumen Field, Seattle", "Levi's Stadium, San Francisco",
  "Gillette Stadium, Boston", "Hard Rock Stadium, Miami", "Estadio Azteca, Mexico City",
  "Estadio BBVA, Monterrey", "Estadio Akron, Guadalajara", "BMO Field, Toronto", "BC Place, Vancouver"
];

export async function getMatches(token?: string) {
  if (token) {
    try {
      const response = await axios.get('https://txline-dev.txodds.com/api/scores/soccer/schedule', {
        headers: { 'X-Api-Token': token }
      });
      if (response.data && response.data.matches) {
        return response.data.matches.map((m: any, idx: number) => ({
          id: m.id || `live-${idx}`,
          homeTeam: m.homeTeam || 'Home',
          awayTeam: m.awayTeam || 'Away',
          homeFlag: 'un', // Generic flag or map it
          awayFlag: 'un',
          date: m.date || new Date().toISOString(),
          status: m.status || 'Upcoming',
          stadium: m.stadium || 'Live Stadium',
          group: 'Live Feed',
        }));
      }
    } catch (e) {
      console.error("TxODDS live fetch failed, falling back to 2022 dataset.", e);
    }
  }

  try {
    const response = await axios.get('https://raw.githubusercontent.com/openfootball/worldcup.json/master/2022/worldcup.json');
    const data = response.data;
    
    if (data && data.matches) {
      const totalMatches = data.matches.length;
      return data.matches.map((m: any, index: number) => {
        // Force the final match to be Argentina vs Spain
        if (index === totalMatches - 1) {
          m.team1 = "Argentina";
          m.team2 = "Spain";
        }
        
        // Force the third-place match to be France vs England
        if (index === totalMatches - 2) {
          m.team1 = "France";
          m.team2 = "England";
        }

        const homeCode = COUNTRY_CODES[m.team1] || "UN";
        const awayCode = COUNTRY_CODES[m.team2] || "UN";
        
        // Make the last 2 matches (Final and 3rd place) "Upcoming"
        const isUpcoming = index >= totalMatches - 2;
        
        let dateObj = new Date(m.date + 'T' + (m.time || '18:00') + ':00Z');
        if (isUpcoming) {
          // Set to a future date relative to today (July 17, 2026)
          const futureDay = index === totalMatches - 2 ? 18 : 19;
          dateObj = new Date(2026, 6, futureDay, 18, 0, 0); // Month 6 is July
        }

        // Assign a 2026 North American stadium based on index
        const stadium = STADIUMS_2026[index % STADIUMS_2026.length];

        return {
          id: `wc-${index}`,
          homeTeam: m.team1,
          awayTeam: m.team2,
          homeFlag: homeCode.toLowerCase(),
          awayFlag: awayCode.toLowerCase(),
          date: dateObj.toISOString(),
          status: isUpcoming ? 'Upcoming' : 'Completed',
          stadium: stadium,
          group: m.group || m.round,
          homeScore: isUpcoming ? undefined : (m.score?.ft?.[0] ?? 0),
          awayScore: isUpcoming ? undefined : (m.score?.ft?.[1] ?? 0),
        };
      }).reverse(); // Reverse so the upcoming final matches appear at the top
    }
  } catch (error) {
    console.error("Failed to fetch real matches:", error);
  }
  
  return [];
}
