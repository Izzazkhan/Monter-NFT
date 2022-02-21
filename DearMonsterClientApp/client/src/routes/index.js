import { lazy } from 'react';
import {
	HUNTERS_VALLEY,
	TRADING_POST,
	INSTRUCTIONS,
	INVENTORY_ALL,
	INVENTORY_TRADING,
	TRAINING_GROUND_OWNED,
	TRAINING_GROUND_SCHOLAR,
	SCHOLARSHIP_MANAGER,
	ON_SCHOLARSHIP_SCHOLAR,
	GOT_SCHOLARSHIP_SCHOLAR
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
		title: 'Trading Post',
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
		path: TRAINING_GROUND_OWNED,
		pathForNavabr: TRAINING_GROUND_OWNED,
		title: 'Training Ground',
		exact: true,
		component: lazy(() => import('../views/pages/TrainingGround')),
	},
	{
		path: TRAINING_GROUND_SCHOLAR,
		pathForNavabr: TRAINING_GROUND_SCHOLAR,
		title: 'Training Ground',
		exact: true,
		hidden: true,
		component: lazy(() => import('../views/pages/TrainingGroundScholar')),
	},
	{
		path: SCHOLARSHIP_MANAGER,
		title: 'Scholarship',
		pathForNavabr: '/scholarship/manager',
		exact: true,
		// hidden: true,
		component: lazy(() => import('../views/pages/ScholarshipManager')),
	},
	{
		path: ON_SCHOLARSHIP_SCHOLAR,
		title: 'Scholarship',
		pathForNavabr: '/scholarship/on-scholar',
		exact: true,
		hidden: true,
		component: lazy(() => import('../views/pages/ScholarshipOnScholar')),
	},
	{
		path: GOT_SCHOLARSHIP_SCHOLAR,
		title: 'Scholarship',
		pathForNavabr: '/scholarship/got-scholar',
		exact: true,
		hidden: true,
		component: lazy(() => import('../views/pages/ScholarshipGotScholar')),
	},
	// {
	// 	path: INSTRUCTIONS,
	// 	pathForNavabr: INSTRUCTIONS,
	// 	title: 'More',
	// 	exact: true,
	// 	component: lazy(() => import('../views/pages/HowToPlay')),
	// },
];

export const Routes = [
	...NavbarRoutes,
];


