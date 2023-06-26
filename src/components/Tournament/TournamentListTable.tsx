import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

import styles from './TournamentListTable.module.css'

import TournamentBracket from '../../../contracts/TournamentBracket.json'
import { BigNumber } from 'ethers'

type Match = {
  id: number
  team1: string
  team2: string
  winner: string
  resultTime: number
}

type Tournament = {
  id: number
  matches: Match[]
  admin: string
}

type Winner = {
  tournamentId: number
  contestId: number
  winner: string
}

const TournamentListTable: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [expandedTournamentIds, setExpandedTournamentIds] = useState<number[]>([])
  const [winnerArgs, setWinnerArgs] = useState<Winner | null>(null)
  const { address: userAddress } = useAccount()

  const { config } = usePrepareContractWrite({
    address: TournamentBracket.address as `0x${string}`,
    abi: TournamentBracket.abi,
    functionName: 'submitContestResult',
    args: [winnerArgs?.tournamentId, winnerArgs?.contestId, winnerArgs?.winner],
    enabled: false,
  })

  const { data: submitResultData, write: submitResult, isLoading } = useContractWrite(config)

  const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
    hash: submitResultData?.hash,
  })

  const { refetch: refetchTournaments } = useContractRead({
    address: TournamentBracket.address as `0x${string}`,
    abi: TournamentBracket.abi,
    functionName: 'getAllTournaments',
    args: [],
    onSuccess(data) {
      const allTournaments = (data as []).map(tournament => {
        const tournamentId = BigNumber.from(tournament[0]).toNumber()
        const tournamentAdmin = tournament[1]
        const matches = (tournament[2] as []).map((match, index) => {
          return {
            id: index,
            team1: match[0] as string,
            team2: match[1] as string,
            winner: match[2] as string,
            resultTime: BigNumber.from(match[3]).toNumber(),
          }
        })

        return {
          id: tournamentId,
          admin: tournamentAdmin,
          matches: matches,
        }
      })
      setTournaments(allTournaments)
    },
  })

  const handleToggleTournament = (tournamentId: number) => {
    if (expandedTournamentIds.includes(tournamentId)) {
      setExpandedTournamentIds(expandedTournamentIds.filter(id => id !== tournamentId))
    } else {
      setExpandedTournamentIds([...expandedTournamentIds, tournamentId])
    }
  }

  const handleSubmit = (tournamentId, contestId, winner) => {
    setWinnerArgs({
      tournamentId: tournamentId,
      contestId: contestId,
      winner: winner,
    })
  }

  useEffect(() => {
    if (submitResult && winnerArgs != null) {
      submitResult()
    }
  }, [winnerArgs])

  useEffect(() => {
    if (isSuccess) refetchTournaments()
  }, [isSuccess])

  const getSubmitButton = (tournamentId: number, match: Match, tournamentAdmin: string) => {
    if (match.team1 == '' || match.team1 == '') {
      return 'Teams yet to win previous contests'
    } else if (match.winner == '') {
      if (userAddress && tournamentAdmin.toLocaleLowerCase() != userAddress.toLocaleLowerCase()) {
        return `Only tournament admin/creater can submit result`
      } else {
        return (
          <>
            <button
              className={styles.submitButton}
              disabled={isLoading || isConfirming}
              onClick={() => {
                handleSubmit(tournamentId, match.id, match.team1)
              }}
            >
              {match.team1}
            </button>
            <button
              className={styles.submitButton}
              disabled={isLoading || isConfirming}
              onClick={() => handleSubmit(tournamentId, match.id, match.team2)}
            >
              {match.team2}
            </button>
          </>
        )
      }
    } else {
      const resultTime = new Date(match.resultTime * 1000).toLocaleString()
      return `${match.winner} won on ${resultTime}`
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
              <span>{tournament.id}</span>
              <span className={styles.toggleButton}>{expandedTournamentIds.includes(tournament.id) ? '-' : '+'}</span>
            </div>
            {expandedTournamentIds.includes(tournament.id) && (
              <div className={styles.tournamentDetails}>
                <h3>Tournament: {tournament.id}</h3>
                <table className={styles.tournamentTable}>
                  <thead>
                    <tr>
                      <th>Match</th>
                      <th>Contest Id</th>
                      <th>Team 1</th>
                      <th>Team 2</th>
                      <th>Winner</th>
                      <th>Submit Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tournament.matches.reverse().map((match, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{match.id}</td>
                        <td>{match.team1}</td>
                        <td>{match.team2}</td>
                        <td>{match.winner}</td>
                        <td className={styles.submitButtons}>
                          {getSubmitButton(tournament.id, match, tournament.admin)}
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
