import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Accueil',
    icon: 'home-outline',
    link: '/pages/home',
    home: true,
  },
  {
    title: 'Visualisation',
    icon: 'monitor-outline',
    link: '/pages/stream',
  },
  {
    title: 'Albums',
    icon: 'image-outline',
    link: '/pages/album',
  },
  {
    title: 'Statistiques',
    icon: 'bar-chart-2-outline',
    link: '/pages/statistics',
  },
  {
    title: 'Paramètres',
    icon: 'settings-2-outline',
    link: '/pages/settings',
  },
  // {
  //   title: 'FEATURES',
  //   group: true,
  // },
  // {
  //   title: 'Auth',
  //   icon: 'lock-outline',
  //   children: [
  //     {
  //       title: 'Login',
  //       link: '/auth/login',
  //     },
  //     {
  //       title: 'Register',
  //       link: '/auth/register',
  //     },
  //     {
  //       title: 'Request Password',
  //       link: '/auth/request-password',
  //     },
  //     {
  //       title: 'Reset Password',
  //       link: '/auth/reset-password',
  //     },
  //   ],
  // },
];
