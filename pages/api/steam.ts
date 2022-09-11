// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

type QueryParams = {
  cursor: string
  key: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  // * is first page
  const { cursor = '*', key, search_text, steam_app_id }: QueryParams = req.query

  const response = await fetch(`http://api.steampowered.com/IPublishedFileService/QueryFiles/v1?appid=${steam_app_id}&numperpage=10&cursor=${cursor}&return_previews=true&return_short_description=true&search_text=${search_text}`, {
    mode: 'cors',
    headers: {
      'x-webapi-key': key
    }
  }).catch((e: any) => {
    return res.status(500).json({ ...e })
  })

  // catchall 401
  if (response.status !== 200 || !response) {
    return res.status(401).json({ message: 'Unauthorised'})
  }

  const jsonbody = await response.json()

  return res.status(200).json({ ...jsonbody.response })
}
