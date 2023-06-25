import React, { useState, useEffect } from 'react'
import styles from './TournamentListTable.module.css'
import Link from 'next/link'

type Match = {
  team1: string
  team2: string
  winner: string
}

type Tournament = {
  id: string
  name: string
  matches: Match[]
}

const TournamentListTable: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [expandedTournamentIds, setExpandedTournamentIds] = useState<string[]>([])

  useEffect(() => {
    // Add sample tournament data on the first render
    const sampleTournaments: Tournament[] = [
      {
        id: '1',
        name: 'Tournament 1',
        matches: [
          { team1: 'Team A', team2: 'Team B', winner: 'Team A' },
          { team1: 'Team C', team2: 'Team D', winner: 'Team D' },
          { team1: 'Team E', team2: 'Team F', winner: 'Team E' },
        ],
      },
      {
        id: '2',
        name: 'Tournament 2',
        matches: [
          { team1: 'Team X', team2: 'Team Y', winner: 'Team X' },
          { team1: 'Team Z', team2: 'Team W', winner: 'Team Z' },
        ],
      },
    ]

    setTournaments(sampleTournaments)
  }, [])

  const handleToggleTournament = (tournamentId: string) => {
    if (expandedTournamentIds.includes(tournamentId)) {
      setExpandedTournamentIds(expandedTournamentIds.filter(id => id !== tournamentId))
    } else {
      setExpandedTournamentIds([...expandedTournamentIds, tournamentId])
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h2>Tournaments</h2>
        <div className={styles.buttonContainer}>
          <Link href="/new">
            <button className={styles.addButton}>Add New Tournament</button>
          </Link>
        </div>
      </div>
      <ul className={styles.tournamentList}>
        {tournaments.map(tournament => (
          <li key={tournament.id} className={styles.tournamentItem}>
            <div
              className={`${styles.tournamentHeader} ${
                expandedTournamentIds.includes(tournament.id) ? styles.expanded : ''
              }`}
              onClick={() => handleToggleTournament(tournament.id)}
            >
              <span>{tournament.name}</span>
              <span className={styles.toggleButton}>{expandedTournamentIds.includes(tournament.id) ? '-' : '+'}</span>
            </div>
            {expandedTournamentIds.includes(tournament.id) && (
              <div className={styles.tournamentDetails}>
                <h3>Tournament: {tournament.name}</h3>
                <table className={styles.tournamentTable}>
                  <thead>
                    <tr>
                      <th>Team 1</th>
                      <th>Team 2</th>
                      <th>Winner</th>
                      <th>Submit Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tournament.matches.map((match, index) => (
                      <tr key={index}>
                        <td>{match.team1}</td>
                        <td>{match.team2}</td>
                        <td>{match.winner}</td>
                        <td>
                          <button
                            className={styles.submitButton}
                            onClick={() => console.log(`Submit result for match ${index}`)}
                          >
                            Submit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TournamentListTable
