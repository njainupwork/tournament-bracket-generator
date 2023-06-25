import React from 'react'
import styles from './Header.module.css'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.title}>Tournament Bracket Generator</div>
      <ConnectButton />
    </header>
  )
}

export default Header
