import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Loader } from 'components/atoms/Loader';
import { URLS } from 'helpers/config';

const Asset = getLazyImport('Asset');
const Following = getLazyImport('Following');
const Landing = getLazyImport('Landing');
const Profile = getLazyImport('Profile');
const ProfileManage = getLazyImport('ProfileManage');
const SignUp = getLazyImport('SignUp');
const Upload = getLazyImport('Upload');
const NotFound = getLazyImport('NotFound');

export default function _Routes() {
	return (
		<Suspense fallback={<Loader />}>
			<Routes>
				<Route path={URLS.base} element={<Landing />} />
				<Route path={`${URLS.asset}:id`} element={<Asset />} />
				<Route path={URLS.following} element={<Following />} />
				<Route path={`${URLS.profile}:address/:active`} element={<Profile />} />
				<Route path={URLS.profileManage} element={<ProfileManage />} />
				<Route path={URLS.signup} element={<SignUp />} />
				<Route path={URLS.upload} element={<Upload />} />
				<Route path={'*'} element={<NotFound />} />
			</Routes>
		</Suspense>
	);
}

function getLazyImport(view: string) {
	return lazy(() =>
		import(`../views/${view}/index.tsx`).then((module) => ({
			default: module.default,
		}))
	);
}
