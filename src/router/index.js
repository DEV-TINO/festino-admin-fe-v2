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
  ],
});

const publicPages = ['Login'];
const adminPages = [''];

// Auth Guard
router.beforeEach(async (to, from) => {
  console.log(to);
  console.log(from);

  const { isUserVaild } = useUser();

  if (publicPages.includes(to.name)) {
    return true;
  }

  const { isAdmin, isValidate } = await isUserVaild();
  if (!isValidate) {
    return { name: 'Login' };
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

export default router;
