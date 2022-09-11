import { useCallback, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { Button, Container, TextField, Typography } from '@mui/material'

import WorkshopResults from '../components/WorkshopResults'

const STEAM_API_KEY = process.env.NEXT_PUBLIC_STEAM_API_KEY || ''

const Home: NextPage = () => {

  // maybe load this from input if needed
  const [steamKey, ] = useState<string>(STEAM_API_KEY)
  const [total, setTotal] = useState<number>(0)

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
    console.log('cursor for')
    console.log(currentCursor)
    console.log(currentStepCount)
    setCursorHistory((state) => ([...state, currentCursor]))
  }, [currentStepCount, currentCursor, setCursorHistory])

  async function searchWorkshopItems(s_text: string, steam_key: string, current_cursor: string) {
    const response = await fetch(`/api/steam?key=${steam_key}&cursor=${current_cursor}&search_text=${s_text}`)
    const jsonraw = await response.json()
    setCurrentItems(jsonraw.publishedfiledetails)
    setCurrentCursor(current_cursor)
    setNextCursor(jsonraw.next_cursor)
    setTotal(jsonraw.total)
  }

  const handleSearch = useCallback(async () => {
    await searchWorkshopItems(searchText, steamKey, currentCursor)
  }, [searchText, steamKey, currentCursor])

  const handleNextPress = useCallback(async () => {
    await searchWorkshopItems(searchText, steamKey, nextCursor)
    setPreviousCursor(currentCursor)
    setCurrentStepCount((state) => (state + 1))
  }, [searchText, steamKey, nextCursor, currentCursor, setCurrentCursor, setPreviousCursor, setCurrentStepCount])

  const handlePreviousPress = useCallback(async () => {
    await searchWorkshopItems(searchText, steamKey, cursorHistory[currentStepCount])
    // setPreviousCursor()
    setCurrentStepCount((state) => (state - 1))
  }, [searchText, steamKey, previousCursor, setCurrentStepCount, setPreviousCursor, cursorHistory, currentStepCount])

  return (
    <Container maxWidth='md'>
      <Typography variant='h1'>
        Project Zomboid
      </Typography>

      <Typography variant='h2'>
        Dedicated Server Mod Helper
      </Typography>

      <TextField
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
