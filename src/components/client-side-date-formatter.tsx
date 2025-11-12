
'use client'

import { useState, useEffect } from 'react'

export function ClientSideDateFormatter({ dateString }: { dateString: string }) {
  const [formattedDate, setFormattedDate] = useState('')

  useEffect(() => {
    if (dateString) {
      const date = new Date(dateString)
      // Ajuste para garantir que a data seja interpretada em UTC e não mude de dia
      const timezoneOffset = date.getTimezoneOffset() * 60000
      const adjustedDate = new Date(date.getTime() + timezoneOffset)
      setFormattedDate(adjustedDate.toLocaleDateString('pt-BR'))
    }
  }, [dateString])

  if (!formattedDate) {
    return null // Retorna nulo durante a renderização do servidor e a primeira renderização do cliente
  }

  return <>{formattedDate}</>
}
