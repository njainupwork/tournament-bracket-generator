import React, { useState, useEffect } from 'react'
import styles from './NewTournament.module.css'

import TournamentBracket from '../../../contracts/TournamentBracket.json'
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import { useRouter } from 'next/router'

const NewTournament: React.FC = () => {
  const router = useRouter()
  const [playerCount, setPlayerCount] = useState<number>(2)
  const [error, setError] = useState<string>('')
  const [inputFields, setInputFields] = useState(0)
  const [players, setPlayers] = useState<string[]>(['', ''])

  const { config } = usePrepareContractWrite({
    address: TournamentBracket.address as `0x${string}`,
    abi: TournamentBracket.abi,
    functionName: 'createNewTournament',
    args: [players],
  })

  const { data: createData, write: createTournament } = useContractWrite(config)
  const { isSuccess } = useWaitForTransaction({
    hash: createData?.hash,
  })

  useEffect(() => {
    if (isSuccess) router.push('/')
  }, [isSuccess])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isPowerOfTwo(playerCount)) {
        setError('')
        renderInputFields()
      } else {
        setError('Number of players must be a power of 2.')
      }
    }, 2000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [playerCount])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(event.target.value)
    setPlayerCount(count)
  }

  const isPowerOfTwo = (num: number) => {
    return num > 1 && (num & (num - 1)) === 0
  }

  const handleSubmit = () => {
    if (createTournament && players.length > 0) createTournament()
  }

  const renderInputFields = () => {
    let newPlayers
    if (players.length < playerCount) {
      newPlayers = [...players, ...Array(playerCount - players.length).fill('')]
    } else {
      newPlayers = players.slice(0, playerCount)
    }
    setPlayers(newPlayers)
    setInputFields(playerCount)
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Create New Tournament</h2>
      <form
        className={styles.form}
        onSubmit={event => {
          event.preventDefault()
        }}
      >
        <label className={styles.label}>
          Number of Players (Power of 2):
          <div className={styles.inputContainer}>
            <input
              type="number"
              value={playerCount}
              onChange={handleInputChange}
              min={0}
              className={styles.inputField}
            />
          </div>
        </label>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.inputFields}>
          {Array(inputFields)
            .fill(0)
            .map((_, i) => (
              <div key={i} className={styles.inputLine}>
                <input
                  type="text"
                  placeholder={`Player ${i + 1}`}
                  className={styles.inputField}
                  onChange={event => {
                    const newPlayers = [...players]
                    newPlayers[i] = event.target.value
                    setPlayers(newPlayers)
                  }}
                  value={players[i]}
                />
              </div>
            ))}
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.createButton} onClick={handleSubmit} disabled={error != ''}>
            Create Tournament
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewTournament
