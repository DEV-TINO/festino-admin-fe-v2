import { createRouter, createWebHistory } from 'vue-router';
import { useUser } from '@/stores/user';
import NotFoundView from '../views/error/NotFoundView.vue';
import { isUUID } from '@/utils/utils';

import BoothListView from '../views/BoothListView.vue';
import LoginView from '../views/LoginView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'BoothLists',
      component: BoothListView,
    },
    {
      path: '/booth/create',
      name: 'BoothCreate',
      component: () => import('../views/BoothEditView.vue'),
    },
    {
      path: '/booth/:boothId/edit',
      name: 'BoothEdit',
      component: () => import('../views/BoothEditView.vue'),
      props: true,
    },
    {
      path: '/booth/:boothId',
      name: 'BoothDetail',
      component: () => import('../views/BoothDetailView.vue'),
      props: true,
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFoundView,
    },
    {
      path: '/mobile',
      name: 'Mobile',
      component: () => import('../layouts/MobileLayout.vue'),
      children: [
        // {
        //   path: '',
        //   name: 'MobileMain',
        //   component: () => import('../views/mobiles/MobileLoginView.vue'),
        // },
        {
          path: 'login',
          name: 'MobileLogin',
          component: () => import('../views/mobiles/MobileLoginView.vue'),
        },
      ],
    },
  ],
});

const publicPages = ['Login', 'MobileLogin'];
const adminPages = [''];

// Auth Guard
router.beforeEach(async (to, from) => {
  console.log('auth guard to : ', to);
  console.log('auth guard from : ', from);

  const { isUserVaild } = useUser();

  if (publicPages.includes(to.name)) {
    return true;
  }

  const { isAdmin, isValidate } = await isUserVaild();
  if (!isValidate) {
    if (from.name.includes('Mobile')) return { name: 'MobileLogin' };
    else return { name: 'Login' };
  }

  if (adminPages.includes(to.name) && isAdmin) return true;
  else if (adminPages.includes(to.name) && !isAdmin)
    return {
      path: from.path,
    };
  else {
    return true;
  }
});

// Booth Guard
router.beforeEach(async (to, from) => {
  console.log('booth guard to : ', to);
  console.log('booth guard from : ', from);
  if (to.name === 'BoothDetail' || to.name === 'BoothEdit') {
    console.log(isUUID(to.params.boothId));
    if (isUUID(to.params.boothId)) return true;
    else {
      return {
        name: 'NotFound',
      };
    }
  } else {
    return true;
  }
});

// Mobile Guard
router.beforeEach((to, from) => {
  console.log('mobile guard to : ', to);
  console.log('mobile guard from : ', from);
  if (to.path.includes('mobile') && to.name === 'NotFound') {
    //Mobile Error Page
    return {
      name: 'MobileLogin',
    };
  }
});

export default router;
