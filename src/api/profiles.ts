import { readHandler } from 'api';

import { AO } from 'helpers/config';
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
		processId: AO.profileRegistry,
		action: 'Get-Profiles-By-Delegate',
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
				walletAddress: fetchedProfile.Owner || null,
				displayName: fetchedProfile.Profile.DisplayName || null,
				username: fetchedProfile.Profile.UserName || null,
				bio: fetchedProfile.Profile.Description || null,
				avatar: fetchedProfile.Profile.ProfileImage || null,
				banner: fetchedProfile.Profile.CoverImage || null,
			};
		} else return emptyProfile;
	} else return emptyProfile;
}
