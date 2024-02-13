import {MenuItem} from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'MENUITEMS.MENU.TEXT',
    isTitle: true
  },
  {
    id: 2,
    label: 'MENUITEMS.DASHBOARD.TEXT',
    icon: 'bx-home',
    link: '/'
  },
  {
    id: 3,
    label: 'MENUITEMS.ADMINISTRATOR_MANAGEMENT.TEXT',
    isTitle: true
  },
  {
    id: 4,
    label: 'MENUITEMS.ADMINISTRATOR.TEXT',
    icon: 'bx-user',
    link: '/administrator-management/administrator'
  },
  {
    id: 5,
    label: 'MENUITEMS.ROLE.TEXT',
    icon: 'bx-user',
    link: '/administrator-management/role'
  },
  {
    id: 6,
    label: 'MENUITEMS.MASTER.TEXT',
    isTitle: true
  },
  {
    id: 7,
    label: 'MENUITEMS.CATEGORY.TEXT',
    icon: 'bx-slider',
    link: 'master/category'
  },
  {
    id: 8,
    label: 'MENUITEMS.SUBCATEGORY.TEXT',
    icon: 'bx-slider',
    link: 'master/sub-category'
  },
  {
    id: 9,
    label: 'MENUITEMS.SUBCATEGORY_PRODUCT.TEXT',
    icon: 'bx-slider',
    link: 'master/sub-category-product'
  }
];

