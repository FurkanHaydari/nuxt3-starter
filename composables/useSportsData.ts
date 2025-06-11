interface Team {
  id: string
  name: string
  logo?: string
  country: string
  ranking?: number
}

interface Match {
  id: string
  homeTeam: Team
  awayTeam: Team
  homeScore: number | null
  awayScore: number | null
  status: 'upcoming' | 'live' | 'finished' | 'postponed'
  startTime: Date
  minute?: string
  league: string
  leagueCountry: string
  odds?: {
    home: number
    draw?: number
    away: number
  }
  isLive: boolean
  period?: string
  venue?: string
}

interface SportCategory {
  id: string
  name: string
  icon: string
  count: number
  isLive: boolean
  matches: Match[]
}

export const useSportsData = () => {
  const generateMatches = (sportType: string, count: number): Match[] => {
    const matches: Match[] = []
    
    const sportData = {
      futbol: {
        teams: [
          { id: '1', name: 'Galatasaray', country: 'Türkiye', ranking: 1 },
          { id: '2', name: 'Fenerbahçe', country: 'Türkiye', ranking: 2 },
          { id: '3', name: 'Beşiktaş', country: 'Türkiye', ranking: 3 },
          { id: '4', name: 'Trabzonspor', country: 'Türkiye', ranking: 4 },
          { id: '5', name: 'Manchester City', country: 'İngiltere', ranking: 1 },
          { id: '6', name: 'Arsenal', country: 'İngiltere', ranking: 2 },
          { id: '7', name: 'Liverpool', country: 'İngiltere', ranking: 3 },
          { id: '8', name: 'Chelsea', country: 'İngiltere', ranking: 4 },
          { id: '9', name: 'Barcelona', country: 'İspanya', ranking: 1 },
          { id: '10', name: 'Real Madrid', country: 'İspanya', ranking: 2 }
        ],
        leagues: ['Süper Lig', 'Premier League', 'La Liga', 'Champions League', 'UEFA Europa League'],
        countries: ['Türkiye', 'İngiltere', 'İspanya', 'Avrupa']
      },
      basketbol: {
        teams: [
          { id: '11', name: 'Lakers', country: 'ABD', ranking: 1 },
          { id: '12', name: 'Warriors', country: 'ABD', ranking: 2 },
          { id: '13', name: 'Celtics', country: 'ABD', ranking: 3 },
          { id: '14', name: 'Nets', country: 'ABD', ranking: 4 },
          { id: '15', name: 'Anadolu Efes', country: 'Türkiye', ranking: 1 },
          { id: '16', name: 'Fenerbahçe Beko', country: 'Türkiye', ranking: 2 },
          { id: '17', name: 'Galatasaray NEF', country: 'Türkiye', ranking: 3 },
          { id: '18', name: 'Real Madrid', country: 'İspanya', ranking: 1 },
          { id: '19', name: 'Barcelona', country: 'İspanya', ranking: 2 },
          { id: '20', name: 'Panathinaikos', country: 'Yunanistan', ranking: 1 }
        ],
        leagues: ['NBA', 'EuroLeague', 'BSL', 'ACB Liga', 'Greek Basket League'],
        countries: ['ABD', 'Türkiye', 'İspanya', 'Yunanistan', 'Avrupa']
      },
      tenis: {
        teams: [
          { id: '21', name: 'Novak Djokovic', country: 'Sırbistan', ranking: 1 },
          { id: '22', name: 'Carlos Alcaraz', country: 'İspanya', ranking: 2 },
          { id: '23', name: 'Daniil Medvedev', country: 'Rusya', ranking: 3 },
          { id: '24', name: 'Alexander Zverev', country: 'Almanya', ranking: 4 },
          { id: '25', name: 'Rafael Nadal', country: 'İspanya', ranking: 5 },
          { id: '26', name: 'Stefanos Tsitsipas', country: 'Yunanistan', ranking: 6 },
          { id: '27', name: 'Jannik Sinner', country: 'İtalya', ranking: 7 },
          { id: '28', name: 'Andrey Rublev', country: 'Rusya', ranking: 8 },
          { id: '29', name: 'Taylor Fritz', country: 'ABD', ranking: 9 },
          { id: '30', name: 'Casper Ruud', country: 'Norveç', ranking: 10 }
        ],
        leagues: ['ATP Masters', 'Grand Slam', 'ATP 500', 'ATP 250', 'Davis Cup'],
        countries: ['Dünya', 'Avrupa', 'Amerika', 'Asya']
      },
      voleybol: {
        teams: [
          { id: '31', name: 'VakıfBank', country: 'Türkiye', ranking: 1 },
          { id: '32', name: 'Eczacıbaşı', country: 'Türkiye', ranking: 2 },
          { id: '33', name: 'Fenerbahçe Opet', country: 'Türkiye', ranking: 3 },
          { id: '34', name: 'Galatasaray HDI', country: 'Türkiye', ranking: 4 },
          { id: '35', name: 'Conegliano', country: 'İtalya', ranking: 1 },
          { id: '36', name: 'Milano', country: 'İtalya', ranking: 2 },
          { id: '37', name: 'Scandicci', country: 'İtalya', ranking: 3 },
          { id: '38', name: 'Porto', country: 'Brezilya', ranking: 1 },
          { id: '39', name: 'Minas', country: 'Brezilya', ranking: 2 },
          { id: '40', name: 'Osasco', country: 'Brezilya', ranking: 3 }
        ],
        leagues: ['Sultanlar Ligi', 'CEV Champions League', 'Serie A1', 'Superliga', 'FIVB Nations League'],
        countries: ['Türkiye', 'İtalya', 'Brezilya', 'Avrupa']
      },
      'buz-hokeyi': {
        teams: [
          { id: '41', name: 'Tampa Bay Lightning', country: 'ABD', ranking: 1 },
          { id: '42', name: 'Colorado Avalanche', country: 'ABD', ranking: 2 },
          { id: '43', name: 'Toronto Maple Leafs', country: 'Kanada', ranking: 1 },
          { id: '44', name: 'Montreal Canadiens', country: 'Kanada', ranking: 2 },
          { id: '45', name: 'Boston Bruins', country: 'ABD', ranking: 3 },
          { id: '46', name: 'New York Rangers', country: 'ABD', ranking: 4 },
          { id: '47', name: 'Detroit Red Wings', country: 'ABD', ranking: 5 },
          { id: '48', name: 'Chicago Blackhawks', country: 'ABD', ranking: 6 },
          { id: '49', name: 'Vancouver Canucks', country: 'Kanada', ranking: 3 },
          { id: '50', name: 'Calgary Flames', country: 'Kanada', ranking: 4 }
        ],
        leagues: ['NHL', 'KHL', 'AHL', 'IIHF World Championship'],
        countries: ['ABD', 'Kanada', 'Rusya', 'Avrupa']
      },
      'amerikan-futbolu': {
        teams: [
          { id: '51', name: 'Kansas City Chiefs', country: 'ABD', ranking: 1 },
          { id: '52', name: 'Buffalo Bills', country: 'ABD', ranking: 2 },
          { id: '53', name: 'Philadelphia Eagles', country: 'ABD', ranking: 3 },
          { id: '54', name: 'San Francisco 49ers', country: 'ABD', ranking: 4 },
          { id: '55', name: 'Dallas Cowboys', country: 'ABD', ranking: 5 },
          { id: '56', name: 'New England Patriots', country: 'ABD', ranking: 6 },  
          { id: '57', name: 'Green Bay Packers', country: 'ABD', ranking: 7 },
          { id: '58', name: 'Pittsburgh Steelers', country: 'ABD', ranking: 8 },
          { id: '59', name: 'Las Vegas Raiders', country: 'ABD', ranking: 9 },
          { id: '60', name: 'Miami Dolphins', country: 'ABD', ranking: 10 }
        ],
        leagues: ['NFL', 'College Football', 'XFL', 'CFL'],
        countries: ['ABD', 'Kanada']
      },
      'beyzbol': {
        teams: [
          { id: '61', name: 'Los Angeles Dodgers', country: 'ABD', ranking: 1 },
          { id: '62', name: 'New York Yankees', country: 'ABD', ranking: 2 },
          { id: '63', name: 'Houston Astros', country: 'ABD', ranking: 3 },
          { id: '64', name: 'Atlanta Braves', country: 'ABD', ranking: 4 },
          { id: '65', name: 'Toronto Blue Jays', country: 'Kanada', ranking: 1 },
          { id: '66', name: 'Boston Red Sox', country: 'ABD', ranking: 5 },
          { id: '67', name: 'Chicago Cubs', country: 'ABD', ranking: 6 },
          { id: '68', name: 'San Francisco Giants', country: 'ABD', ranking: 7 },
          { id: '69', name: 'Philadelphia Phillies', country: 'ABD', ranking: 8 },
          { id: '70', name: 'St. Louis Cardinals', country: 'ABD', ranking: 9 }
        ],
        leagues: ['MLB', 'Minor League', 'World Baseball Classic', 'College Baseball'],
        countries: ['ABD', 'Kanada', 'Japonya', 'Güney Kore']
      },
      'golf': {
        teams: [
          { id: '71', name: 'Scottie Scheffler', country: 'ABD', ranking: 1 },
          { id: '72', name: 'Jon Rahm', country: 'İspanya', ranking: 2 },
          { id: '73', name: 'Rory McIlroy', country: 'Kuzey İrlanda', ranking: 3 },
          { id: '74', name: 'Viktor Hovland', country: 'Norveç', ranking: 4 },
          { id: '75', name: 'Xander Schauffele', country: 'ABD', ranking: 5 },
          { id: '76', name: 'Patrick Cantlay', country: 'ABD', ranking: 6 },
          { id: '77', name: 'Wyndham Clark', country: 'ABD', ranking: 7 },
          { id: '78', name: 'Ludvig Aberg', country: 'İsveç', ranking: 8 },
          { id: '79', name: 'Collin Morikawa', country: 'ABD', ranking: 9 },
          { id: '80', name: 'Brian Harman', country: 'ABD', ranking: 10 }
        ],
        leagues: ['PGA Tour', 'European Tour', 'Masters', 'US Open', 'The Open Championship'],
        countries: ['ABD', 'Avrupa', 'Asya', 'Avustralya']
      },
      'esports': {
        teams: [
          { id: '81', name: 'T1', country: 'Güney Kore', ranking: 1 },
          { id: '82', name: 'G2 Esports', country: 'Almanya', ranking: 2 },
          { id: '83', name: 'Fnatic', country: 'İngiltere', ranking: 3 },
          { id: '84', name: 'Team Liquid', country: 'ABD', ranking: 4 },
          { id: '85', name: 'FaZe Clan', country: 'ABD', ranking: 5 },
          { id: '86', name: 'NAVI', country: 'Ukrayna', ranking: 6 },
          { id: '87', name: 'Astralis', country: 'Danimarka', ranking: 7 },
          { id: '88', name: 'Cloud9', country: 'ABD', ranking: 8 },
          { id: '89', name: 'TSM', country: 'ABD', ranking: 9 },
          { id: '90', name: 'Evil Geniuses', country: 'ABD', ranking: 10 }
        ],
        leagues: ['League of Legends', 'CS:GO', 'Valorant', 'Dota 2', 'Overwatch'],
        countries: ['Dünya', 'Avrupa', 'Amerika', 'Asya', 'Okyanusya']
      },
      'diger': {
        teams: [
          { id: '91', name: 'Formula 1 Team Mercedes', country: 'Almanya', ranking: 1 },
          { id: '92', name: 'Formula 1 Team Red Bull', country: 'Avusturya', ranking: 2 },
          { id: '93', name: 'UFC Fighter A', country: 'ABD', ranking: 1 },
          { id: '94', name: 'UFC Fighter B', country: 'Brezilya', ranking: 2 },
          { id: '95', name: 'Boxing Champion', country: 'İngiltere', ranking: 1 },
          { id: '96', name: 'Boxing Challenger', country: 'Meksika', ranking: 2 },
          { id: '97', name: 'Swimming Team A', country: 'ABD', ranking: 1 },
          { id: '98', name: 'Swimming Team B', country: 'Avustralya', ranking: 2 },
          { id: '99', name: 'Athletics Team', country: 'Jamaika', ranking: 1 },
          { id: '100', name: 'Cycling Team', country: 'Fransa', ranking: 1 }
        ],
        leagues: ['Formula 1', 'UFC', 'Boxing', 'Olympics', 'Athletics', 'Swimming'],
        countries: ['Dünya', 'Avrupa', 'Amerika', 'Asya', 'Okyanusya']
      }
    }

    const currentSport = sportData[sportType as keyof typeof sportData] || sportData.futbol
    
    for (let i = 0; i < count; i++) {
      const homeTeam = currentSport.teams[Math.floor(Math.random() * currentSport.teams.length)]
      let awayTeam = currentSport.teams[Math.floor(Math.random() * currentSport.teams.length)]
      
      // Ensure different teams
      while (awayTeam.id === homeTeam.id) {
        awayTeam = currentSport.teams[Math.floor(Math.random() * currentSport.teams.length)]
      }

      const isLive = Math.random() < 0.3 // 30% chance of being live
      const isFinished = Math.random() < 0.4 // 40% chance of being finished
      const isUpcoming = !isLive && !isFinished

      let status: Match['status'] = 'upcoming'
      if (isLive) status = 'live'
      else if (isFinished) status = 'finished'

      const startTime = new Date()
      if (isUpcoming) {
        startTime.setHours(startTime.getHours() + Math.floor(Math.random() * 48)) // Next 48 hours
      } else if (isFinished) {
        startTime.setHours(startTime.getHours() - Math.floor(Math.random() * 24)) // Last 24 hours
      }

      let homeScore: number | null = null
      let awayScore: number | null = null
      let minute: string | undefined

      if (isLive || isFinished) {
        if (sportType === 'futbol') {
          homeScore = Math.floor(Math.random() * 5)
          awayScore = Math.floor(Math.random() * 5)
          minute = isLive ? `${Math.floor(Math.random() * 90) + 1}'` : "90'"
        } else if (sportType === 'basketbol') {
          homeScore = Math.floor(Math.random() * 50) + 80
          awayScore = Math.floor(Math.random() * 50) + 80
          minute = isLive ? `Q${Math.floor(Math.random() * 4) + 1} ${Math.floor(Math.random() * 12)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : 'Final'
        } else if (sportType === 'tenis') {
          homeScore = Math.floor(Math.random() * 3)
          awayScore = Math.floor(Math.random() * 3)
          minute = isLive ? `Set ${Math.floor(Math.random() * 3) + 1}` : 'Final'
        } else if (sportType === 'voleybol') {
          homeScore = Math.floor(Math.random() * 4)
          awayScore = Math.floor(Math.random() * 4)
          minute = isLive ? `Set ${Math.floor(Math.random() * 5) + 1}` : 'Final'
        } else if (sportType === 'buz-hokeyi') {
          homeScore = Math.floor(Math.random() * 6)
          awayScore = Math.floor(Math.random() * 6)
          minute = isLive ? `${Math.floor(Math.random() * 3) + 1}. Periyot ${Math.floor(Math.random() * 20)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : 'Final'
        } else if (sportType === 'amerikan-futbolu') {
          homeScore = Math.floor(Math.random() * 35) + 7
          awayScore = Math.floor(Math.random() * 35) + 7
          minute = isLive ? `Q${Math.floor(Math.random() * 4) + 1} ${Math.floor(Math.random() * 15)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : 'Final'
        } else if (sportType === 'beyzbol') {
          homeScore = Math.floor(Math.random() * 12)
          awayScore = Math.floor(Math.random() * 12)
          minute = isLive ? `${Math.floor(Math.random() * 9) + 1}. İnning` : 'Final'
        } else if (sportType === 'golf') {
          homeScore = Math.floor(Math.random() * 10) - 5 // Golf için par altı/üstü
          awayScore = Math.floor(Math.random() * 10) - 5
          minute = isLive ? `Hole ${Math.floor(Math.random() * 18) + 1}` : 'Final'
        } else if (sportType === 'esports') {
          homeScore = Math.floor(Math.random() * 3)
          awayScore = Math.floor(Math.random() * 3)
          minute = isLive ? `Map ${Math.floor(Math.random() * 3) + 1}` : 'Final'
        }
      }

      const match: Match = {
        id: `match_${sportType}_${i}`,
        homeTeam,
        awayTeam,
        homeScore,
        awayScore,
        status,
        startTime,
        minute,
        league: currentSport.leagues[Math.floor(Math.random() * currentSport.leagues.length)],
        leagueCountry: currentSport.countries[Math.floor(Math.random() * currentSport.countries.length)],
        odds: {
          home: +(1.5 + Math.random() * 3).toFixed(2),
          draw: sportType === 'futbol' ? +(2.5 + Math.random() * 2).toFixed(2) : undefined,
          away: +(1.5 + Math.random() * 3).toFixed(2)
        },
        isLive,
        period: minute,
        venue: `${homeTeam.name} Stadium`
      }

      matches.push(match)
    }

    return matches.sort((a, b) => {
      if (a.isLive && !b.isLive) return -1
      if (!a.isLive && b.isLive) return 1
      return a.startTime.getTime() - b.startTime.getTime()
    })
  }

  const sportsData = ref<SportCategory[]>([
    {
      id: 'futbol',
      name: 'Futbol',
      icon: 'bi bi-dribbble',
      count: 0,
      isLive: true,
      matches: []
    },
    {
      id: 'basketbol',
      name: 'Basketbol',
      icon: 'bi bi-basketball',
      count: 0,
      isLive: true,
      matches: []
    },
    {
      id: 'tenis',
      name: 'Tenis',
      icon: 'bi bi-tennis',
      count: 0,
      isLive: false,
      matches: []
    },
    {
      id: 'voleybol',
      name: 'Voleybol',
      icon: 'bi bi-volleyball',
      count: 0,
      isLive: true,
      matches: []
    },
    {
      id: 'buz-hokeyi',
      name: 'Buz Hokeyi',
      icon: 'bi bi-snow2',
      count: 0,
      isLive: false,
      matches: []
    },
    {
      id: 'amerikan-futbolu',
      name: 'Amerikan Futbolu',
      icon: 'bi bi-football',
      count: 0,
      isLive: true,
      matches: []
    },
    {
      id: 'beyzbol',
      name: 'Beyzbol',
      icon: 'bi bi-baseball',
      count: 0,
      isLive: false,
      matches: []
    },
    {
      id: 'golf',
      name: 'Golf',
      icon: 'bi bi-golf',
      count: 0,
      isLive: false,
      matches: []
    },
    {
      id: 'esports',
      name: 'E-Spor',
      icon: 'bi bi-controller',
      count: 0,
      isLive: true,
      matches: []
    },
    {
      id: 'diger',
      name: 'Diğer Sporlar',
      icon: 'bi bi-trophy',
      count: 0,
      isLive: false,
      matches: []
    }
  ])

  // Initialize matches for each sport
  const initializeSportsData = () => {
    sportsData.value.forEach(sport => {
      const matchCount = Math.floor(Math.random() * 20) + 5 // 5-25 maç arası
      sport.matches = generateMatches(sport.id, matchCount)
      sport.count = sport.matches.length
      sport.isLive = sport.matches.some(match => match.isLive)
    })
  }

  const getSportMatches = (sportId: string): Match[] => {
    const sport = sportsData.value.find(s => s.id === sportId)
    return sport?.matches || []
  }

  const getLiveMatches = (): Match[] => {
    return sportsData.value.flatMap(sport => 
      sport.matches.filter(match => match.isLive)
    )
  }

  const getUpcomingMatches = (limit: number = 10): Match[] => {
    return sportsData.value.flatMap(sport => 
      sport.matches.filter(match => match.status === 'upcoming')
    ).slice(0, limit)
  }

  // Dynamic updates
  let updateInterval: NodeJS.Timeout | null = null
  
  const updateOdds = () => {
    sportsData.value.forEach(sport => {
      sport.matches.forEach(match => {
        if (match.odds && Math.random() < 0.3) { // 30% chance to update odds
          const variation = 0.1 + Math.random() * 0.2 // 10-30% variation
          const direction = Math.random() > 0.5 ? 1 : -1
          
          match.odds.home = Math.max(1.1, +(match.odds.home + (match.odds.home * variation * direction)).toFixed(2))
          match.odds.away = Math.max(1.1, +(match.odds.away + (match.odds.away * variation * direction)).toFixed(2))
          
          if (match.odds.draw) {
            match.odds.draw = Math.max(1.1, +(match.odds.draw + (match.odds.draw * variation * direction)).toFixed(2))
          }
        }
      })
    })
  }

  const updateLiveScores = () => {
    sportsData.value.forEach(sport => {
      sport.matches.forEach(match => {
        if (match.isLive && match.status === 'live' && Math.random() < 0.4) { // 40% chance to update live scores
          const sportType = sport.id
          
          if (sportType === 'futbol') {
            // Update minute
            const currentMinute = parseInt(match.minute?.replace("'", '') || '0')
            if (currentMinute < 90) {
              match.minute = `${currentMinute + Math.floor(Math.random() * 3) + 1}'`
            }
            
            // Maybe score a goal
            if (Math.random() < 0.15) { // 15% chance
              if (Math.random() > 0.5) {
                match.homeScore = (match.homeScore || 0) + 1
              } else {
                match.awayScore = (match.awayScore || 0) + 1
              }
            }
          } else if (sportType === 'basketbol') {
            // Update score more frequently
            if (Math.random() < 0.6) { // 60% chance
              const points = Math.random() > 0.7 ? 3 : 2 // 3-pointer or 2-pointer
              if (Math.random() > 0.5) {
                match.homeScore = (match.homeScore || 0) + points
              } else {
                match.awayScore = (match.awayScore || 0) + points
              }
            }
          }
        }
      })
    })
  }

  const finishMatches = () => {
    sportsData.value.forEach(sport => {
      sport.matches.forEach(match => {
        if (match.isLive && Math.random() < 0.05) { // 5% chance to finish a live match
          match.status = 'finished'
          match.isLive = false
          
          if (sport.id === 'futbol') {
            match.minute = "90'"
          } else if (sport.id === 'basketbol') {
            match.minute = 'Final'
          } else if (sport.id === 'tenis') {
            match.minute = 'Final'
          } else if (sport.id === 'voleybol') {
            match.minute = 'Final'
          }
        }
      })
    })
  }

  const startNewMatches = () => {
    sportsData.value.forEach(sport => {
      const upcomingMatches = sport.matches.filter(match => match.status === 'upcoming')
      
      upcomingMatches.forEach(match => {
        if (Math.random() < 0.08) { // 8% chance to start an upcoming match
          match.status = 'live'
          match.isLive = true
          
          const sportType = sport.id
          if (sportType === 'futbol') {
            match.homeScore = 0
            match.awayScore = 0
            match.minute = "1'"
          } else if (sportType === 'basketbol') {
            match.homeScore = 0
            match.awayScore = 0
            match.minute = 'Q1 12:00'
          } else if (sportType === 'tenis') {
            match.homeScore = 0
            match.awayScore = 0
            match.minute = 'Set 1'
          } else if (sportType === 'voleybol') {
            match.homeScore = 0
            match.awayScore = 0
            match.minute = 'Set 1'
          } else if (sportType === 'buz-hokeyi') {
            match.homeScore = 0
            match.awayScore = 0
            match.minute = '1. Periyot 20:00'
          } else if (sportType === 'amerikan-futbolu') {
            match.homeScore = 0
            match.awayScore = 0
            match.minute = 'Q1 15:00'
          } else if (sportType === 'beyzbol') {
            match.homeScore = 0
            match.awayScore = 0
            match.minute = '1. İnning'
          } else if (sportType === 'golf') {
            match.homeScore = 0
            match.awayScore = 0
            match.minute = 'Hole 1'
          } else if (sportType === 'esports') {
            match.homeScore = 0
            match.awayScore = 0
            match.minute = 'Map 1'
          }
        }
      })
      
      // Update sport live status
      sport.isLive = sport.matches.some(match => match.isLive)
    })
  }

  const addNewUpcomingMatches = () => {
    sportsData.value.forEach(sport => {
      const finishedMatches = sport.matches.filter(match => match.status === 'finished')
      
      // If we have too many finished matches, replace some with new upcoming matches
      if (finishedMatches.length > 5 && Math.random() < 0.1) { // 10% chance
        const matchesToReplace = Math.min(2, finishedMatches.length - 3)
        
        for (let i = 0; i < matchesToReplace; i++) {
          const newMatches = generateMatches(sport.id, 1)
          const newMatch = newMatches[0]
          
          // Ensure it's upcoming
          newMatch.status = 'upcoming'
          newMatch.isLive = false
          newMatch.homeScore = null
          newMatch.awayScore = null
          newMatch.minute = undefined
          
          // Set future start time
          const futureTime = new Date()
          futureTime.setHours(futureTime.getHours() + Math.floor(Math.random() * 24) + 1)
          newMatch.startTime = futureTime
          
          // Replace oldest finished match
          const oldestFinished = finishedMatches.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())[0]
          const index = sport.matches.indexOf(oldestFinished)
          sport.matches[index] = newMatch
        }
      }
    })
  }

  const performDynamicUpdates = () => {
    updateOdds()
    updateLiveScores()
    finishMatches()
    startNewMatches()
    addNewUpcomingMatches()
  }

  const startDynamicUpdates = () => {
    if (updateInterval) return // Already running
    
    updateInterval = setInterval(() => {
      performDynamicUpdates()
    }, 3000) // Update every 3 seconds
  }

  const stopDynamicUpdates = () => {
    if (updateInterval) {
      clearInterval(updateInterval)
      updateInterval = null
    }
  }

  return {
    sportsData: readonly(sportsData),
    initializeSportsData,
    getSportMatches,
    getLiveMatches,
    getUpcomingMatches,
    generateMatches,
    startDynamicUpdates,
    stopDynamicUpdates,
    performDynamicUpdates
  }
} 