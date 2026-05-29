import {createRouter, createWebHistory} from "vue-router";

const routes = [
    {
        path: '/',
        name:'login',
        component: () => import('../components/Login.vue'),
    },{
        path: '/home',
        name:'home',
        component: () => import('../components/home.vue'),
        children:[
            {
                path:'/address_book',
                name:'address_book',
                component: () => import('../components/address_book.vue'),
                children:[

                ]
            }
        ]
    }

]


const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    if (to.name !== 'login' && !token) {
        next({name: 'login'})
    } else {
        next()
    }
})

export default router
