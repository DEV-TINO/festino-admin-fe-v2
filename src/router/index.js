import { createRouter, createWebHistory } from 'vue-router';
import { useUser } from '@/stores/user';
import NotFoundView from '../views/error/NotFoundView.vue';
import { isUUID } from '@/utils/utils';

import BoothListView from '../views/booth/BoothListView.vue';
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
      component: () => import('../views/booth/BoothEditView.vue'),
    },
    {
      path: '/booth/:boothId/edit',
      name: 'BoothEdit',
      component: () => import('../views/booth/BoothEditView.vue'),
      props: true,
    },
    {
      path: '/booth/:boothId',
      name: 'BoothDetail',
      component: () => import('../views/booth/BoothDetailView.vue'),
      props: true,
    },
    {
      path: '/reserve',
      name: 'Tabling',
      component: () => import('../views/reserve/TablingView.vue'),
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
      path: '/order',
      name: 'Order',
      component: () => import('../layouts/OrderLayout.vue'),
      children: [
        {
          path: '',
          name: 'OrderRealTime',
          component: () => import('../views/order/OrderRealTime.vue'),
        },
        {
          path: 'ready',
          name: 'OrderReady',
          component: () => import('../views/order/OrderReady.vue'),
        },
        {
          path: 'cooking',
          name: 'OrderCooking',
          component: () => import('../views/order/OrderCooking.vue'),
        },
        {
          path: 'finish',
          name: 'OrderFinish',
          component: () => import('../views/order/OrderFinish.vue'),
        },
        {
          path: 'cancel',
          name: 'OrderCancel',
          component: () => import('../views/order/OrderCancel.vue'),
        },
        {
          path: 'statistics',
          name: 'OrderStatistics',
          component: () => import('../views/order/OrderStatistics.vue'),
        },
      ],
    },
    {
      path: '/mobile',
      name: 'Mobile',
      component: () => import('../layouts/MobileLayout.vue'),
      children: [
        {
          path: '',
          name: 'MobileMain',
          component: () => import('../views/mobiles/MobileMainView.vue'),
        },
        {
          path: 'login',
          name: 'MobileLogin',
          component: () => import('../views/mobiles/MobileLoginView.vue'),
        },
        {
          path: 'reserve',
          name: 'MobileReserve',
          component: () => import('../views/mobiles/MobileReserveView.vue'),
        },
        {
          path: 'booth',
          name: 'MobileBooth',
          component: () => import('../views/mobiles/MobileBoothManageView.vue'),
        },
      ],
    },
  ],
});

const publicPages = ['Login', 'MobileLogin'];
const adminPages = [''];
const isMobile = navigator.userAgent.indexOf('iPhone') > -1 || navigator.userAgent.indexOf('Android') > -1;

// Auth Guard
router.beforeEach(async (to, from) => {
  const { isUserVaild, getUserOwnBoothId } = useUser();

  if (publicPages.includes(to.name)) {
    return true;
  }

  const { isAdmin, isValidate } = await isUserVaild();
  await getUserOwnBoothId();

  if (!isValidate) {
    if (from.name?.includes('Mobile') || isMobile) return { name: 'MobileLogin' };
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
  if (to.name === 'BoothDetail' || to.name === 'BoothEdit') {
    const { isUserOwnBooth } = useUser();
    const isOwn = await isUserOwnBooth(to.params.boothId);
    if (isOwn) {
      return true;
    } else {
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
  if (to.path.includes('mobile') && to.name === 'NotFound') {
    //Mobile Error Page
    return {
      name: 'MobileLogin',
    };
  }
  if (to.path === '/' && isMobile) {
    return {
      name: 'MobileMain',
    };
  }
});

export default router;
