import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Home',
    icon: 'home-outline',
    link: '/pages/home',
    home: true,
  },
  {
    title: 'Streaming',
    icon: 'monitor-outline',
    link: '/pages/stream',
  },
  {
    title: 'Album',
    icon: 'image-outline',
    link: '/pages/album',
  },
  {
    title: 'Statistics',
    icon: 'bar-chart-2-outline',
    link: '/pages/statistics',
  }, {
    title: 'Monitoring',
    icon: 'activity-outline',
    link: '/pages/ressources',
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
