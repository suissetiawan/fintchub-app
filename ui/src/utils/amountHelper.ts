export const getFontSizeClass = (amount: number, baseClass: string = 'text-2xl'): string => {
  const absAmount = Math.abs(amount)
  const length = Math.floor(absAmount).toString().length

  // Scaling logic based on baseClass
  if (baseClass === 'text-3xl') {
    if (length >= 9) return 'text-xl' // Billions
    if (length >= 6) return 'text-2xl' // Millions
  } else if (baseClass === 'text-2xl') {
    if (length >= 9) return 'text-lg' // Billions
    if (length >= 6) return 'text-xl' // Millions
  } else if (baseClass === 'text-lg' || baseClass === 'text-xl') {
    if (length >= 9) return 'text-sm'
    if (length >= 6) return 'text-base'
  } else if (baseClass === 'text-base') {
    if (length >= 9) return 'text-xs'
    if (length >= 6) return 'text-sm'
  }

  return baseClass
}

export const getTextFontSizeClass = (text: string, baseClass: string = 'text-base'): string => {
  const length = text?.length || 0
  if (length > 25) return 'text-xs'
  if (length > 18) return 'text-sm'
  return baseClass
}
