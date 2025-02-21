import {
  type AccountInfo,
  PublicClientApplication,
  type RedirectRequest,
} from '@azure/msal-browser'
import { reactive } from 'vue'

export const msalConfig = {
  auth: {
    clientId: '909acdce-f7b3-4488-a8aa-85774a9e00d3',
    authority: 'https://login.microsoftonline.com/b60a5c7c-d418-442b-a56d-611dec81e33e',
    redirectUri: window.location.origin, // Replace with your actual redirect URI
    postLogoutUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage', // This configures where your cache will be stored
    storeAuthStateInCookie: false,
  },
}
export const graphScopes: RedirectRequest = {
  scopes: ['user.read', 'openid', 'profile'],
}
export const state = reactive({
  isAuthenticated: false,
  user: null as AccountInfo | null,
})

export const msalInstance = new PublicClientApplication(msalConfig)
