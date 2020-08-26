import ScatterJS from '@scatterjs/core'
import ScatterEOS from '@scatterjs/eosjs2'
import {
  Authenticator, ButtonStyle, Chain,
  UALError, UALErrorType, User
} from 'universal-authenticator-library'
import { Name } from './interfaces'
import { scatterLogo } from './scatterLogo'
import { wombatLogo } from './wombatLogo'
import { ScatterUser } from './ScatterUser'
import { UALScatterError } from './UALScatterError'
import { isMobile } from './utils'

declare let window: any

export class Scatter extends Authenticator {
  private users: ScatterUser[] = []
  private scatter: any
  private appName: string
  private scatterIsLoading: boolean = false
  private initError: UALError | null = null

  /**
   * Scatter Constructor.
   *
   * @param chains
   * @param options { appName } appName is a required option to use Scatter
   */
  constructor(chains: Chain[], options?: any) {
    super(chains)
    if (options && options.appName) {
      this.appName = options.appName
    } else {
      throw new UALScatterError('Scatter requires the appName property to be set on the `options` argument.',
        UALErrorType.Initialization,
        null)
    }
  }

  /**
   * Checks Scatter for a live connection.  Will set an Initialization Error
   * if we cannot connect to scatter.
   */
  public async init(): Promise<void> {
    this.scatterIsLoading = true
    ScatterJS.plugins(new ScatterEOS())

    // set an errored state if scatter doesn't connect
    if (!await ScatterJS.scatter.connect(this.appName)) {
      this.initError = new UALScatterError('Error occurred while connecting',
        UALErrorType.Initialization,
        null
      )

      this.scatterIsLoading = false

      return
    }

    this.scatter = ScatterJS.scatter
    window.ScatterJS = null

    this.scatterIsLoading = false
  }

  public reset(): void {
    this.initError = null
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.init()
  }

  public isLoading(): boolean {
    return this.scatterIsLoading
  }

  public isErrored(): boolean {
    return !!this.initError
  }

  public getError(): UALError | null {
    return this.initError
  }

  public getStyle(): ButtonStyle {
    if(this.isMobile()) {
      return {
        icon: wombatLogo,
        text: `Wombat`,
        textColor: 'white',
        background: '#ff4028'
      }
    }
    return {
      icon: scatterLogo,
      text: Name,
      textColor: 'white',
      background: '#078CE9'
    }
  }

  /**
   * Scatter will only render on Desktop Browser Environments
   */
  public shouldRender(): boolean {
    return true;
  }

  public shouldAutoLogin(): boolean {
    return false
  }

  public async login(_?: string): Promise<User[]> {
    this.users = []

    try {
      for (const chain of this.chains) {
        const user = new ScatterUser(chain, this.scatter)
        await user.getKeys()
        this.users.push(user)
      }

      return this.users
    } catch (e) {
      throw new UALScatterError(
        'Unable to login',
        UALErrorType.Login,
        e)
    }
  }

  /**
   * Call logout on scatter.  Throws a Logout Error if unsuccessful
   */
  public async logout(): Promise<void> {
    try {
      this.scatter.logout()
    } catch (error) {
      throw new UALScatterError('Error occurred during logout',
        UALErrorType.Logout,
        error)
    }
  }

  /**
   * Scatter provides account names so it does not need to request it
   */
  public async shouldRequestAccountName(): Promise<boolean> {
    return false
  }

  public isMobile(): boolean {
    return isMobile()
  }

  public getOnboardingLink(): string {
    return this.isMobile() ? 'https://getwombat.io/' : 'https://get-scatter.com/'
  }

  public requiresGetKeyConfirmation(): boolean {
    return false
  }

  public getName(): string {
    return Name
  }
}
