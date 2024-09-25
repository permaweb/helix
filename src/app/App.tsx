import { lazy, Suspense } from 'react';

import { Loader } from 'components/atoms/Loader';
import { DOM } from 'helpers/config';
import Navigation from 'navigation';

import * as S from './styles';

const Routes = lazy(() =>
	import(`../routes/Routes.tsx` as any).then((module) => ({
		default: module.default,
	}))
);

export default function App() {
	return (
		<>
			<div id={DOM.loader} />
			<div id={DOM.notification} />
			<div id={DOM.overlay} />
			<Suspense fallback={<Loader />}>
				<Navigation />
				<S.View className={'scroll-wrapper'}>
					<Routes />
				</S.View>
			</Suspense>
		</>
	);
}
