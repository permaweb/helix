import { readHandler } from 'api';

import { AOS } from 'helpers/config';
import { ProfileHeaderType } from 'helpers/types';

export async function getProfile(args: { address: string }): Promise<ProfileHeaderType | null> {
	const emptyProfile = {
		id: null,
		walletAddress: args.address,
		displayName: null,
		username: null,
		bio: null,
		avatar: null,
		banner: null,
	};

	const profileLookup = await readHandler({
		processId: AOS.profileRegistry,
		action: 'Get-Profiles-By-Address',
		data: { Address: args.address },
	});

	let activeProfileId: string;
	if (profileLookup && profileLookup.length > 0 && profileLookup[0].ProfileId) {
		activeProfileId = profileLookup[0].ProfileId;
	}

	if (activeProfileId) {
		const fetchedProfile = await readHandler({
			processId: activeProfileId,
			action: 'Info',
			data: null,
		});

		if (fetchedProfile) {
			return {
				id: activeProfileId,
				walletAddress: args.address,
				displayName: fetchedProfile.Profile.DisplayName || null,
				username: fetchedProfile.Profile.Username || null,
				bio: fetchedProfile.Profile.Bio || null,
				avatar: fetchedProfile.Profile.Avatar || null,
				banner: fetchedProfile.Profile.Banner || null,
			};
		} else return emptyProfile;
	} else return emptyProfile;
}
