import {Registry} from '../views/registry/registry';
import Wallet from '../views/Wallet';
import {RegistryApplication} from '../views/registry/application';
import RegistryVoting from '../views/registry/voting';
import RegistryRevealing from '../views/registry/revealing';
import { RegistryView } from '../views/registry/registry-view';
import { VotingView } from '../views/registry/voting-view';
import { ChallengeView } from '../views/registry/challenge-view';
import Apply from '../views/Apply';
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