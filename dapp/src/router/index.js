import Wallet from '../views/Wallet';
import RegistryApplication from '../views/RegistryApplication';
import RegistryVoting from '../views/RegistryVoting';
import RegistryRevealing from '../views/RegistryRevealing';
import RegistryView from '../views/RegistryView';
import VotingView from '../views/VotingView';
import ChallengeView from '../views/ChallengeView';
import Apply from '../views/Apply';

export const sideNavRoutes = [
  {
    path: '/applynocivic',
    title: 'APPLY',
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
    path: '/apply',
    component: Apply,
  },
  {
    path: '/applynocivic',
    component: Apply,
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
