import { lazy } from 'react';
import {
	HUNTERS_VALLEY,
	TRADING_POST,
	INSTRUCTIONS,
	INVENTORY_ALL,
	INVENTORY_TRADING,
	TRAINING_GROUND,
	SCHOLARSHIP_MANAGER,
	SCHOLARSHIP_SCHOLAR
} from './routesPath';

export const NavbarRoutes = [
	{
		path: HUNTERS_VALLEY,
		pathForNavabr: HUNTERS_VALLEY,
		title: "Hunter's Valley",
		exact: true,
		component: lazy(() => import('../views/pages/HuntersValley')),
	},
	{
		path: TRADING_POST,
		pathForNavabr: TRADING_POST,
		title: 'Trading post',
		exact: true,
		component: lazy(() => import('../views/pages/TradingPost')),
	},
	{
		path: INVENTORY_ALL,
		title: 'Inventory',
		pathForNavabr: '/inventory/all',
		exact: true,
		component: lazy(() => import('../views/pages/InventoryAll')),
	},
	{
		path: INVENTORY_TRADING,
		title: 'Inventory Trading',
		pathForNavabr: '/inventory/trading',
		exact: true,
		hidden: true,
		component: lazy(() => import('../views/pages/InventoryTrading')),
	},
	{
		path: TRAINING_GROUND,
		pathForNavabr: TRAINING_GROUND,
		title: 'Training Ground',
		exact: true,
		component: lazy(() => import('../views/pages/TrainingGround')),
	},
	{
		path: SCHOLARSHIP_MANAGER,
		title: 'Scholarship',
		pathForNavabr: '/scholarship/manager',
		exact: true,
		component: lazy(() => import('../views/pages/ScholarshipManager')),
	},
	{
		path: SCHOLARSHIP_SCHOLAR,
		title: 'Scholarship',
		pathForNavabr: '/scholarship/scholar',
		exact: true,
		hidden: true,
		component: lazy(() => import('../views/pages/ScholarshipScholar')),
	},
	{
		path: INSTRUCTIONS,
		pathForNavabr: INSTRUCTIONS,
		title: 'More',
		exact: true,
		component: lazy(() => import('../views/pages/HowToPlay')),
	},
];

export const Routes = [
	...NavbarRoutes,
];


