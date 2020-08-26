import { isMobile } from './utils'

export const DesktopName: string = 'Scatter'
export const MobileName: string = 'Wombat'
export const Name: string = isMobile() ? MobileName : DesktopName