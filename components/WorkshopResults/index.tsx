import { useCallback, useState } from 'react'
import { Box, Button, Dialog, Typography } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import CheckIcon from '@mui/icons-material/Check';

type WorkshopResultsProps = {
  total: number
  items: any[]
  cursor: string
  style: React.CSSProperties
  selectedMap: { [key: string]: boolean }
  setSelectedMap: Function
  handleNextPress: Function
  handlePreviousPress: Function
}

type WorkshopItem = {
  publishedfileid: string
  title: string
  preview_url: string
}

type SelectionMapHelper = {
  string: string
}

const WorkshopResults: React.FC<WorkshopResultsProps> = ({
  cursor, total, items, setSelectedMap, selectedMap,
  handleNextPress, handlePreviousPress, ...props}) => {

  const [open, setOpen] = useState(false)

  const handleClick = useCallback((workshopID: string) => {
    setSelectedMap((state: any) => {
      let newState = Object.assign({}, state);
      if (state[workshopID]) {
        newState[workshopID] = false
      } else {
        newState[workshopID] = true
      }

      return {
        ...newState,
      }
    })
  }, [setSelectedMap])

  const handleOpenDialog = useCallback(() => {
    setOpen(true)
  }, [setOpen])

  return (
    <Box {...props}>

      <Grid2
        sx={{
          '&:hover': {
            color: '#00695f'
          }
        }}
        container
        spacing={2}
        justifyContent={{xs: 'center', sm: 'center', md: 'space-between'}}
      >
        {items && items.map(({ publishedfileid, title, preview_url }: WorkshopItem) => (
          <Grid2 md='auto' style={{ cursor: 'pointer' }} onClick={() => (handleClick(publishedfileid))} key={publishedfileid}>
            <Typography variant='subtitle1' key={publishedfileid}>
              {title}

              {selectedMap[publishedfileid] && <CheckIcon style={{ position: 'absolute' }} />}
            </Typography>

            <img
              style={{justifySelf: 'center'}}
              src={`${preview_url}`}
              srcSet={`${preview_url}`}
              width='300px'
              height='300px'
              alt={title}
              loading="lazy"
            />
          </Grid2>
        ))}
      </Grid2>

      <Box style={{marginTop: '5em'}} display='flex' justifyContent={'space-between'}>
        <Typography variant='subtitle1'>Total - {total}</Typography>
        <Button variant='contained' disabled={cursor === '*'} onClick={() => (handlePreviousPress())}>Previous</Button>
        <Button variant='contained' onClick={() => (handleNextPress())}>Next</Button>
      </Box>

      <Box style={{ marginTop: '5em', marginBottom: '5em' }}>
        <Button variant='outlined' onClick={handleOpenDialog}>View Current Mod/Workshop ID List</Button>
      </Box>

      <Dialog
        open={open}
        onClose={() => (setOpen(false))}
      >
        <Box p='2em'>
          <Typography variant='body2'>
            <span style={{fontWeight: 'bold'}}>WorkshopIDs:&nbsp;</span>
            {Object.keys(selectedMap).map(selectedProp => {
              if (selectedMap[selectedProp]) {
                return (
                  <>
                    {selectedProp};
                  </>
                )
              }
            })}
          </Typography>
        </Box>
      </Dialog>
    </Box>
  )
}

export default WorkshopResults