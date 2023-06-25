import React from 'react'
import styles from 'styles/Home.module.scss'
import TournamentListTable from 'components/Tournament/TournamentListTable'

export default function Home() {
  return (
    <div className={styles.container}>
      <Main />
    </div>
  )
}

function Main() {
  return (
    <main className={styles.main + ' space-y-6'}>
      <TournamentListTable />
    </main>
  )
}
