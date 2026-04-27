/**
 * Returns the initials of a given name.
 * e.g. "Bambang Sugiono" -> "BS"
 * e.g. "Bambang" -> "B"
 */
export function getInitials(name: string): string {
  if (!name) return ''
  
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }
  
  const first = parts[0].charAt(0)
  const last = parts[parts.length - 1].charAt(0)
  
  return (first + last).toUpperCase()
}
