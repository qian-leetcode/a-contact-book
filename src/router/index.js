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
                    {
                        path:'/group',
                        name:'group',
                        component: () => import('../components/addresss_book/group.vue'),
                    },{
                        path:'/letter_sort',
                        name:'letter_sort',
                        component: () => import('../components/addresss_book/letter_sort.vue'),
                    }
                ]
            },{
                path: '/group_management',
                name:'group_management',
                component: () => import('../components/group_management.vue'),
            },{
                path:'/Personal_Center',
                name:'personal_center',
                component: () => import('../components/Personal_Center.vue'),
            },{
                path:'/Dictionary_Management',
                name:'dictionary_management',
                component:() => import('../components/Dictionary_Management.vue'),
            },{
                path: '/Account_Management',
                name:'account_management',
                component:()=>import('../components/Account_Management.vue'),
            },{
            path: '/statistics',
                name:'statistics',
            component:() => import('../components/statistics.vue'),
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
