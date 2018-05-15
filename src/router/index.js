import {Registry} from '../components/registry/registry.js'
import {Wallet} from '../components/wallet/wallet.js'
import {RegistryApplication} from '../components/registry/application.js'
import RegistryVoting from '../components/registry/voting.js'
import RegistryRevealing from '../components/registry/revealing.js'
import { RegistryView } from '../components/registry/registry-view.jsx'
import { VotingView } from '../components/registry/voting-view.jsx'
import { ChallengeView } from '../components/registry/challenge-view.jsx'
import Apply from '../components/apply/apply.js'
import Search from '../components/search/search.js'

export const sideNavRoutes = [
  {
    path: '/apply',
    title: 'APPLY',
    icon: 'ti-pencil-alt',
  },
  {
    path: '/applynocivic',
    title: 'APPLY (Without Civic)',
    icon: 'ti-pencil-alt',
  },
  {
    path: '/registry-application',
    title: 'PHYSICIAN REGISTRY',
    icon: 'ti-agenda',
  },
  {
    path: '/registry-voting',
    title: 'CHALLENGES',
    icon: 'ti-unlink',
  },
  {
    path: '/registry-revealing',
    title: 'VOTES',
    icon: 'ti-stats-up',
  },
];

export const appRoutes = [
  {
    path: '/registry',
    component: Registry,
  },
  {
    path: '/apply',
    component: Apply,
  },
  {
    path: '/applynocivic',
    component: Apply,
    props: { noCivic: true },
  },
  {
    path: '/search',
    component: Search,
  },
  {
    path: '/registry-application',
    component: RegistryApplication,
  },
  {
    path: '/registry-voting',
    component: RegistryVoting,
  },
  {
    path: '/registry-revealing',
    component: RegistryRevealing,
  },
  {
    path: '/registry-view/:id',
    component: RegistryView,
  },
  {
    path: '/voting-view/:id',
    component: VotingView,
  },
  {
    path: '/challenge-view/:id',
    component: ChallengeView,
  },
  {
    path: '/wallet',
    component: Wallet,
  },
];