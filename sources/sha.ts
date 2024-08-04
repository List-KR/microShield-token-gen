export async function StringToSHA1HEX(Str: string) {
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-1', new TextEncoder().encode(Str)))).map(Block =>Block.toString(16).padStart(2, '0')).join('')
}