import { useCallback, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { Button, Container, TextField, Typography } from '@mui/material'

import WorkshopResults from '../components/WorkshopResults'

const STEAM_API_KEY = process.env.NEXT_PUBLIC_STEAM_API_KEY || ''

const Home: NextPage = () => {

  // maybe load this from input if needed
  const [steamKey, ] = useState<string>(STEAM_API_KEY)
  const [total, setTotal] = useState<number>(0)
  const [steamAppID, setSteamAppID] = useState('108600')

  const [previousCursor, setPreviousCursor] = useState('*')
  const [nextCursor, setNextCursor] = useState('*')
  const [currentCursor, setCurrentCursor] = useState('*')

  const [searchText, setSearchText] = useState('')
  const [currentItems, setCurrentItems] = useState([])

  const [selectedMap, setSelectedMap] = useState<{ [key: string]: boolean }>({})

  // keep track of current step
  const [currentStepCount, setCurrentStepCount] = useState<number>(1)
  const [cursorHistory, setCursorHistory] = useState<string[]>(['*'])

  useEffect(() => {
    setCursorHistory((state) => ([...state, currentCursor]))
  }, [currentStepCount, currentCursor, setCursorHistory])

  // pass controlled values in...maybe dep tree can be simplified idk
  async function searchWorkshopItems(s_text: string, steam_key: string, current_cursor: string, steam_app_id: string) {
    const response = await fetch(`/api/steam?key=${steam_key}&cursor=${current_cursor}&search_text=${s_text}&steam_app_id=${steam_app_id}`)
    const jsonraw = await response.json()
    setCurrentItems(jsonraw.publishedfiledetails)
    setCurrentCursor(current_cursor)
    setNextCursor(jsonraw.next_cursor)
    setTotal(jsonraw.total)
  }

  const handleSearch = useCallback(async () => {
    await searchWorkshopItems(searchText, steamKey, currentCursor, steamAppID)
  }, [searchText, steamKey, currentCursor, steamAppID])

  const handleNextPress = useCallback(async () => {
    await searchWorkshopItems(searchText, steamKey, nextCursor, steamAppID)
    setPreviousCursor(currentCursor)
    setCurrentStepCount((state) => (state + 1))
  }, [searchText, steamKey, nextCursor, currentCursor, setCurrentCursor, setPreviousCursor, setCurrentStepCount, steamAppID])

  const handlePreviousPress = useCallback(async () => {
    await searchWorkshopItems(searchText, steamKey, cursorHistory[currentStepCount], steamAppID)
    // setPreviousCursor()
    setCurrentStepCount((state) => (state - 1))
  }, [searchText, steamKey, previousCursor, setCurrentStepCount, setPreviousCursor, cursorHistory, currentStepCount, steamAppID])

  return (
    <Container maxWidth='md'>
      <Typography variant='h1'>
        Steam
      </Typography>

      <Typography variant='h2'>
        Dedicated Server Mod Helper
      </Typography>

      <Typography variant='body1'>
        Get a list of WorkshopIDs, useful for games like Project Zomboid.
      </Typography>

      <TextField
        style={{ marginTop: '1em' }}
        onChange={(ev: any) => (setSteamAppID(ev.target.value))}
        value={steamAppID}
        helperText='appID'
        fullWidth={true}
        variant='filled'
        id='standard-basic'
        label='Steam appID'
      />

      <TextField
        style={{marginTop: '1em'}}
        onChange={(ev: any) => (setSearchText(ev.target.value))}
        helperText='Search for a mod...'
        fullWidth={true}
        variant='filled'
        id='standard-basic'
        label='Mod Name'
      />

      <Button
        style={{ marginTop: '1em' }}
        variant='contained'
        onClick={() => { handleSearch() }}
      >
        Search
      </Button>

      <WorkshopResults
        style={{marginTop: '1em'}}
        cursor={currentCursor}
        items={currentItems}
        total={total}
        selectedMap={selectedMap}
        setSelectedMap={setSelectedMap}
        handleNextPress={handleNextPress}
        handlePreviousPress={handlePreviousPress}
      />
    </Container>
  )
}

export default Home
