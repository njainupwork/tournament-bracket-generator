import React from 'react'
import styles from 'styles/Home.module.scss'

import NewTournament from 'components/NewTournament/NewTournament'

export default function New() {
  return (
    <div className={styles.container}>
      <NewTournament />
    </div>
  )
}
