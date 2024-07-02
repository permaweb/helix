import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Checkbox } from 'components/atoms/Checkbox';
import { concatLicenseTag } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useLanguageProvider } from 'providers/LanguageProvider';
import { RootState } from 'store';
import * as uploadActions from 'store/upload/actions';

import * as S from './styles';
import { UploadStepsLicenseFull } from './UploadStepsLicenseFull';

export default function UploadStepsLicense() {
	const dispatch = useDispatch();

	const uploadReducer = useSelector((state: RootState) => state.uploadReducer);

	const arProvider = useArweaveProvider();

	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	const [hasLicense, setHasLicense] = React.useState<boolean>(uploadReducer.data.hasLicense);
	const [licenseParams, setLicenseParams] = React.useState<any>(null);
	const [activeLicense, setActiveLicense] = React.useState<string>(uploadReducer.data.activeLicense || '');
	const [licenseAmount, _setLicenseAmount] = React.useState<number>(0.01);

	const [viewAdvanced, setViewAdvanced] = React.useState<boolean>(false);

	const optionValues = {
		['1']: 'commercial-use-derivations-one-time-fee',
		['2']: 'non-commercial-use-derivations-one-time-fee',
		['3']: 'non-commercial-use-no-derivations',
	};

	const options = [
		{
			label: 'Commercial Use + Derivations, One Time Fee',
			value: optionValues['1'],
			description:
				'Content can be used for commercial purposes. Derivations of the artwork are permitted, usage requires a one time payment.',
		},
		{
			label: 'Non-Commercial Use + Derivations, One Time Fee',
			value: optionValues['2'],
			description:
				'Content can only be used for non-commercial purposes. Derivations of the artwork are permitted, usage is free for all. Crediting original artist is necessary',
		},
		{
			label: 'Non-Commercial Use + No Derivations',
			value: optionValues['3'],
			description:
				'The use, distribution or derivation of this content is restricted for all purposes. Rights to the artwork belong to the artist alone.',
		},
	];

	React.useEffect(() => {
		if (language && language.licenseTags) {
			setLicenseParams(language.licenseTags);
		}
	}, [language]);

	React.useEffect(() => {
		dispatch(
			uploadActions.setUpload([
				{
					field: 'hasLicense',
					data: hasLicense,
				},
			])
		);
	}, [hasLicense]);

	React.useEffect(() => {
		if (hasLicense && !activeLicense) {
			dispatch(uploadActions.setStepDisabled(true));
		} else {
			dispatch(uploadActions.setStepDisabled(false));
		}

		if (licenseParams) {
			const license: any = {};
			if (activeLicense && activeLicense.length) {
				license.paymentMode = {
					value: licenseParams.paymentMode.single,
					recipient: arProvider.walletAddress || '',
				};

				license.accessFee = {
					value: concatLicenseTag(licenseParams.access.options.oneTime),
					amount: licenseAmount.toString(),
				};

				license.dataModelTraining = {
					value: licenseParams.dataModelTraining.options.disallowed,
					terms: {
						value: licenseParams.dataModelTraining.options.suboptions.oneTimeFee,
						amount: '0',
					},
				};

				switch (activeLicense) {
					case optionValues['1']:
						license.commercialUse = {
							value: concatLicenseTag(licenseParams.commercialUse.options.allowed),
							terms: {
								value: concatLicenseTag(licenseParams.commercialUse.options.suboptions.oneTimeFee),
								amount: licenseAmount.toString(),
							},
						};

						license.derivations = {
							value: concatLicenseTag(licenseParams.derivations.options.allowed),
							terms: {
								value: concatLicenseTag(licenseParams.derivations.options.suboptions.oneTimeFee),
								amount: licenseAmount.toString(),
							},
						};
						break;
					case optionValues['2']:
						license.commercialUse = {
							value: licenseParams.commercialUse.options.disallowed,
							terms: {
								value: licenseParams.derivations.options.suboptions.oneTimeFee,
								amount: '0',
							},
						};

						license.derivations = {
							value: concatLicenseTag(licenseParams.derivations.options.allowed),
							terms: {
								value: concatLicenseTag(licenseParams.derivations.options.suboptions.oneTimeFee),
								amount: licenseAmount.toString(),
							},
						};
						break;
					case optionValues['3']:
						license.commercialUse = {
							value: licenseParams.commercialUse.options.disallowed,
							terms: {
								value: concatLicenseTag(licenseParams.commercialUse.options.suboptions.oneTimeFee),
								amount: licenseAmount.toString(),
							},
						};

						license.derivations = {
							value: licenseParams.derivations.options.disallowed,
							terms: {
								value: concatLicenseTag(licenseParams.commercialUse.options.suboptions.oneTimeFee),
								amount: '0',
							},
						};
						break;
				}
			} else {
				license.accessFee = {
					value: licenseParams.access.options.none,
					amount: '0',
				};

				license.commercialUse = {
					value: licenseParams.commercialUse.options.disallowed,
					terms: {
						value: concatLicenseTag(licenseParams.commercialUse.options.suboptions.oneTimeFee),
						amount: '0',
					},
				};

				license.derivations = {
					value: licenseParams.derivations.options.disallowed,
					terms: {
						value: concatLicenseTag(licenseParams.derivations.options.suboptions.oneTimeFee),
						amount: '0',
					},
				};
			}

			dispatch(
				uploadActions.setUpload([
					{
						field: 'license',
						data: license,
					},
				])
			);
		}
	}, [licenseParams, activeLicense, licenseAmount, hasLicense, arProvider.walletAddress]);

	function handleLicenseChange(value: string) {
		let licenseUpdate = '';

		if (activeLicense === value) {
			licenseUpdate = '';
		} else {
			licenseUpdate = value;
		}

		setActiveLicense(licenseUpdate);
		dispatch(
			uploadActions.setUpload([
				{
					field: 'activeLicense',
					data: licenseUpdate,
				},
			])
		);
	}

	return (
		<S.Wrapper>
			<S.Header>
				<span>{language.udl}</span>
				<S.CWrapper>
					<span>{language.assetLicenseCheck}</span>
					<Checkbox checked={hasLicense} handleSelect={() => setHasLicense(!hasLicense)} disabled={false} />
				</S.CWrapper>
			</S.Header>
			<S.OptionsWrapper>
				{options.map((option) => (
					<S.Option
						key={option.value}
						disabled={!hasLicense}
						active={activeLicense === option.value}
						onClick={() => handleLicenseChange(option.value)}
					>
						<span>{option.label}</span>
						<p>{option.description}</p>
					</S.Option>
				))}
			</S.OptionsWrapper>
			<S.AWrapper>
				<S.CWrapper>
					<span>{language.viewAdvancedOptions}</span>
					<Checkbox checked={viewAdvanced} handleSelect={() => setViewAdvanced(!viewAdvanced)} disabled={!hasLicense} />
				</S.CWrapper>
				{viewAdvanced && (
					<S.ALicenseWrapper>
						<UploadStepsLicenseFull hasLicense={hasLicense} />
					</S.ALicenseWrapper>
				)}
			</S.AWrapper>
		</S.Wrapper>
	);
}
