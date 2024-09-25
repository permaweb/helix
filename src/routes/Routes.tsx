import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import { URLS } from 'helpers/config';

const Landing = getLazyImport('Landing');
const Upload = getLazyImport('Upload');
const Docs = getLazyImport('Docs');
const NotFound = getLazyImport('NotFound');

export default function _Routes() {
	return (
		<Routes>
			<Route path={URLS.base} element={<Landing />} />
			<Route path={URLS.upload} element={<Upload />} />
			<Route path={URLS.docs} element={<Docs />} />
			<Route path={`${URLS.docs}:active/*`} element={<Docs />} />
			<Route path={'*'} element={<NotFound />} />
		</Routes>
	);
}

function getLazyImport(view: string) {
	return lazy(() =>
		import(`../views/${view}/index.tsx`).then((module) => ({
			default: module.default,
		}))
	);
}
