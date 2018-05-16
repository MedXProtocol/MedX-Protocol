import {Registry} from '../components/registry/registry';
import {Wallet} from '../components/wallet/wallet';
import {RegistryApplication} from '../components/registry/application';
import RegistryVoting from '../components/registry/voting';
import RegistryRevealing from '../components/registry/revealing';
import { RegistryView } from '../components/registry/registry-view';
import { VotingView } from '../components/registry/voting-view';
import { ChallengeView } from '../components/registry/challenge-view';
import Apply from '../components/Apply';
import Search from '../components/search/search';

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