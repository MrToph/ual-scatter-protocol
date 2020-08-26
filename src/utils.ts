export const isMobile = () => {
  if(typeof window === `undefined` || !window.navigator || !window.navigator.userAgent) return false;

  const userAgent = window.navigator.userAgent
  const isIOS = userAgent.includes('iPhone') || userAgent.includes('iPad')
  const isMobile = userAgent.includes('Mobile')
  const isAndroid = userAgent.includes('Android')
  const isCustom = userAgent.toLowerCase().includes('eoslynx')
  
  return isIOS || isMobile || isAndroid || isCustom
}