import { DOM } from 'helpers/config';
import Navigation from 'navigation';
import { Routes } from 'routes';

import * as S from './styles';

export default function App() {
	return (
		<>
			<div id={DOM.loader} />
			<div id={DOM.notification} />
			<div id={DOM.overlay} />
			<Navigation />
			<S.View>
				<Routes />
			</S.View>
		</>
	);
}
