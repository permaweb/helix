import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReactSVG } from 'react-svg';

import { Checkbox } from 'components/atoms/Checkbox';
import { FormField } from 'components/atoms/FormField';
import { Select } from 'components/atoms/Select';
import { ASSETS } from 'helpers/config';
import { SelectOptionType } from 'helpers/types';
import { checkAddress, concatLicenseTag } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useLanguageProvider } from 'providers/LanguageProvider';
import { RootState } from 'store';
import * as uploadActions from 'store/upload/actions';

import * as S from './styles';

export default function UploadStepsLicense() {
	const dispatch = useDispatch();

	const uploadReducer = useSelector((state: RootState) => state.uploadReducer);

	const arProvider = useArweaveProvider();

	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	const [hasLicense, setHasLicense] = React.useState<boolean>(uploadReducer.data.hasLicense);
	const [license, setLicense] = React.useState<any>(uploadReducer.data.license);
	const [licenseParams, setLicenseParams] = React.useState<any>(null);

	const [accessFee, setAccessFee] = React.useState<SelectOptionType | null>(null);
	const [accessFeeAmount, setAccessFeeAmount] = React.useState<number>(0);

	const [derivations, setDerivations] = React.useState<SelectOptionType | null>(null);
	const [derivationsTerm, setDerivationsTerm] = React.useState<SelectOptionType | null>(null);
	const [derivationsTermAmount, setDerivationsTermAmount] = React.useState<number>(0);

	const [commercialUse, setCommercialUse] = React.useState<SelectOptionType | null>(null);
	const [commercialUseTerm, setCommercialUseTerm] = React.useState<SelectOptionType | null>(null);
	const [commercialUseTermAmount, setCommercialUseTermAmount] = React.useState<number>(0);

	const [dataModelTraining, setDataModelTraining] = React.useState<SelectOptionType | null>(null);
	const [dataModelTrainingTerm, setDataModelTrainingTerm] = React.useState<SelectOptionType | null>(null);
	const [dataModelTrainingTermAmount, setDataModelTrainingTermAmount] = React.useState<number>(0);

	const [paymentMode, setPaymentMode] = React.useState<SelectOptionType | null>(null);
	const [paymentRecipient, setPaymentRecipient] = React.useState<string>('');

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
		if (licenseParams) {
			setAccessFee({
				id: concatLicenseTag(
					uploadReducer?.data?.license?.accessFee
						? uploadReducer.data.license.accessFee.value
						: licenseParams.access.options.none
				),
				label: uploadReducer?.data?.license?.accessFee
					? uploadReducer.data.license.accessFee.value
					: licenseParams.access.options.none,
			});
			if (uploadReducer?.data?.license?.accessFee) {
				setAccessFeeAmount(Number(uploadReducer.data.license.accessFee.amount));
			}

			setDerivations({
				id: concatLicenseTag(
					uploadReducer?.data?.license?.derivations
						? uploadReducer.data.license.derivations.value
						: licenseParams.derivations.options.disallowed
				),
				label: uploadReducer?.data?.license?.derivations
					? uploadReducer.data.license.derivations.value
					: licenseParams.derivations.options.disallowed,
			});
			if (uploadReducer?.data?.license?.derivations?.terms) {
				setDerivationsTerm({
					id: concatLicenseTag(uploadReducer.data.license.derivations.terms.value),
					label: uploadReducer.data.license.derivations.terms.value,
				});
				setDerivationsTermAmount(uploadReducer.data.license.derivations.terms.amount);
			} else {
				setDerivationsTerm({
					id: licenseParams.addTerms,
					label: licenseParams.addTerms,
				});
			}

			setCommercialUse({
				id: concatLicenseTag(
					uploadReducer?.data?.license?.commercialUse
						? uploadReducer.data.license.commercialUse.value
						: licenseParams.commercialUse.options.disallowed
				),
				label: uploadReducer?.data?.license?.commercialUse
					? uploadReducer.data.license.commercialUse.value
					: licenseParams.commercialUse.options.disallowed,
			});
			if (uploadReducer?.data?.license?.commercialUse?.terms) {
				setCommercialUseTerm({
					id: concatLicenseTag(uploadReducer.data.license.commercialUse.terms.value),
					label: uploadReducer.data.license.commercialUse.terms.value,
				});
				setCommercialUseTermAmount(uploadReducer.data.license.commercialUse.terms.amount);
			} else {
				setCommercialUseTerm({
					id: licenseParams.addTerms,
					label: licenseParams.addTerms,
				});
			}

			setDataModelTraining({
				id: concatLicenseTag(
					uploadReducer?.data?.license?.dataModelTraining
						? uploadReducer.data.license.dataModelTraining.value
						: licenseParams.dataModelTraining.options.disallowed
				),
				label: uploadReducer?.data?.license?.dataModelTraining
					? uploadReducer.data.license.dataModelTraining.value
					: licenseParams.dataModelTraining.options.disallowed,
			});
			if (uploadReducer?.data?.license?.dataModelTraining?.terms) {
				setDataModelTrainingTerm({
					id: concatLicenseTag(uploadReducer.data.license.dataModelTraining.terms.value),
					label: uploadReducer.data.license.dataModelTraining.terms.value,
				});
				setDataModelTrainingTermAmount(uploadReducer.data.license.dataModelTraining.terms.amount);
			} else {
				setDataModelTrainingTerm({
					id: licenseParams.addTerms,
					label: licenseParams.addTerms,
				});
			}

			setPaymentMode({
				id: concatLicenseTag(
					uploadReducer?.data?.license?.paymentMode
						? uploadReducer.data.license.paymentMode.value
						: licenseParams.paymentMode.single
				),
				label: uploadReducer?.data?.license?.paymentMode
					? uploadReducer.data.license.paymentMode.value
					: licenseParams.paymentMode.single,
			});
			if (uploadReducer?.data?.license?.paymentMode?.recipient) {
				setPaymentRecipient(uploadReducer.data.license.paymentMode.recipient);
			}
		}
	}, [licenseParams]);

	React.useEffect(() => {
		if (arProvider.walletAddress) setPaymentRecipient(arProvider.walletAddress);
		else setPaymentRecipient('');
	}, [arProvider.walletAddress]);

	React.useEffect(() => {
		if (licenseParams) {
			let updatedLicense = { ...license };

			if (accessFee) {
				if (accessFee.id === concatLicenseTag(licenseParams.access.options.none)) setAccessFeeAmount(0);
				updatedLicense.accessFee = {
					value: accessFee.id,
					amount: accessFeeAmount,
				};
			}

			if (derivations) {
				updatedLicense.derivations = {
					value: derivations.id,
					terms: {
						value: derivationsTerm.id,
						amount: derivationsTermAmount,
					},
				};
			}

			if (commercialUse) {
				updatedLicense.commercialUse = {
					value: commercialUse.id,
					terms: {
						value: commercialUseTerm.id,
						amount: commercialUseTermAmount,
					},
				};
			}

			if (dataModelTraining) {
				updatedLicense.dataModelTraining = {
					value: dataModelTraining.id,
					terms: {
						value: dataModelTrainingTerm.id,
						amount: dataModelTrainingTermAmount,
					},
				};
			}

			if (paymentMode) {
				if (paymentMode.id !== concatLicenseTag(licenseParams.paymentMode.single)) setPaymentRecipient('');
				else if (!paymentRecipient && arProvider.walletAddress) setPaymentRecipient(arProvider.walletAddress);
				updatedLicense.paymentMode = {
					value: paymentMode.id,
					recipient: paymentRecipient,
				};
			}
			setLicense(updatedLicense);
		}
	}, [
		licenseParams,
		accessFee,
		accessFeeAmount,
		derivations,
		derivationsTerm,
		derivationsTermAmount,
		commercialUse,
		commercialUseTerm,
		commercialUseTermAmount,
		dataModelTraining,
		dataModelTrainingTerm,
		dataModelTrainingTermAmount,
		paymentMode,
		paymentRecipient,
		arProvider.walletAddress,
	]);

	React.useEffect(() => {
		if (!hasLicense) dispatch(uploadActions.setStepDisabled(false));
		else {
			if (
				(accessFee && accessFee.id !== licenseParams.access.options.none && accessFeeAmount <= 0) ||
				(derivations &&
					derivations.id !== concatLicenseTag(licenseParams.derivations.options.disallowed) &&
					derivationsTermAmount <= 0 &&
					(derivationsTerm.id === concatLicenseTag(licenseParams.derivations.options.suboptions.revenueShare) ||
						derivationsTerm.id === concatLicenseTag(licenseParams.derivations.options.suboptions.monthlyFee) ||
						derivationsTerm.id === concatLicenseTag(licenseParams.derivations.options.suboptions.oneTimeFee))) ||
				(commercialUse &&
					commercialUse.id !== concatLicenseTag(licenseParams.commercialUse.options.disallowed) &&
					commercialUseTermAmount <= 0) ||
				(dataModelTraining &&
					dataModelTraining.id !== concatLicenseTag(licenseParams.dataModelTraining.options.disallowed) &&
					dataModelTrainingTermAmount <= 0) ||
				(paymentMode &&
					paymentMode.id === concatLicenseTag(licenseParams.paymentMode.single) &&
					!checkAddress(paymentRecipient))
			) {
				dispatch(uploadActions.setStepDisabled(true));
			} else {
				dispatch(uploadActions.setStepDisabled(false));
			}
		}
	}, [
		hasLicense,
		accessFee,
		accessFeeAmount,
		derivations,
		derivationsTerm,
		derivationsTermAmount,
		commercialUse,
		commercialUseTermAmount,
		dataModelTraining,
		dataModelTrainingTermAmount,
		paymentMode,
		paymentRecipient,
	]);

	React.useEffect(() => {
		dispatch(
			uploadActions.setUpload([
				{
					field: 'license',
					data: license,
				},
			])
		);
	}, [license]);

	function getDerivationsTermAmountIcon() {
		if (derivationsTerm) {
			switch (derivationsTerm.id) {
				case concatLicenseTag(licenseParams.derivations.options.suboptions.monthlyFee):
				case concatLicenseTag(licenseParams.derivations.options.suboptions.oneTimeFee):
					return <ReactSVG src={ASSETS.u} />;
				case concatLicenseTag(licenseParams.derivations.options.suboptions.revenueShare):
					return <span>%</span>;
				default:
					return <ReactSVG src={ASSETS.u} />;
			}
		} else return null;
	}

	function getCommercialUseAmountIcon() {
		if (derivationsTerm) {
			switch (commercialUseTerm.id) {
				case concatLicenseTag(licenseParams.commercialUse.options.suboptions.monthlyFee):
				case concatLicenseTag(licenseParams.commercialUse.options.suboptions.oneTimeFee):
					return <ReactSVG src={ASSETS.u} />;
				case concatLicenseTag(licenseParams.commercialUse.options.suboptions.revenueShare):
					return <span>%</span>;
				default:
					return <ReactSVG src={ASSETS.u} />;
			}
		} else return null;
	}

	function getDerivationsTermAmount() {
		const disabled =
			!derivations ||
			derivations.id === concatLicenseTag(licenseParams.derivations.options.disallowed) ||
			derivationsTerm.id === licenseParams.addTerms ||
			derivationsTerm.id === concatLicenseTag(licenseParams.derivations.options.suboptions.credit) ||
			derivationsTerm.id === concatLicenseTag(licenseParams.derivations.options.suboptions.indication) ||
			derivationsTerm.id === concatLicenseTag(licenseParams.derivations.options.suboptions.licensePassthrough) ||
			!hasLicense;
		return (
			<S.IWrapper disabled={disabled}>
				<FormField
					type={'number'}
					value={derivationsTermAmount}
					onChange={(e: any) => setDerivationsTermAmount(e.target.value)}
					invalid={{ status: derivationsTermAmount < 0, message: null }}
					disabled={disabled}
					hideErrorMessage
				/>
				{getDerivationsTermAmountIcon()}
			</S.IWrapper>
		);
	}

	function getCommercialUseTermAmount() {
		const disabled =
			!commercialUse ||
			commercialUse.id === concatLicenseTag(licenseParams.commercialUse.options.disallowed) ||
			commercialUseTerm.id === licenseParams.addTerms ||
			!hasLicense;
		return (
			<S.IWrapper disabled={disabled}>
				<FormField
					type={'number'}
					value={commercialUseTermAmount}
					onChange={(e: any) => setCommercialUseTermAmount(e.target.value)}
					invalid={{ status: commercialUseTermAmount < 0, message: null }}
					disabled={disabled}
					hideErrorMessage
				/>
				{getCommercialUseAmountIcon()}
			</S.IWrapper>
		);
	}

	function getDataModelTrainingTermAmount() {
		const disabled =
			!dataModelTraining ||
			dataModelTraining.id === concatLicenseTag(licenseParams.dataModelTraining.options.disallowed) ||
			dataModelTrainingTerm.id === licenseParams.addTerms ||
			!hasLicense;

		return (
			<S.IWrapper disabled={disabled}>
				<FormField
					type={'number'}
					value={dataModelTrainingTermAmount}
					onChange={(e: any) => setDataModelTrainingTermAmount(e.target.value)}
					invalid={{ status: dataModelTrainingTermAmount < 0, message: null }}
					disabled={disabled}
					hideErrorMessage
				/>
				<ReactSVG src={ASSETS.u} />
			</S.IWrapper>
		);
	}

	function getPaymentRecipient() {
		let disabled = !hasLicense;
		if (paymentMode) {
			if (
				paymentMode.id === concatLicenseTag(licenseParams.paymentMode.random) ||
				paymentMode.id === concatLicenseTag(licenseParams.paymentMode.global)
			) {
				disabled = true;
			}
		} else {
			disabled = true;
		}
		return (
			<S.AWrapper disabled={false}>
				<FormField
					label={language.recipient}
					value={paymentRecipient}
					onChange={(e: any) => setPaymentRecipient(e.target.value)}
					invalid={{ status: paymentRecipient ? !checkAddress(paymentRecipient) : true, message: null }}
					disabled={disabled}
					hideErrorMessage
					required
				/>
			</S.AWrapper>
		);
	}

	return licenseParams ? (
		<S.Wrapper className={'border-wrapper-primary'}>
			<S.Header>
				<span>{language.udl}</span>
				<S.CWrapper>
					<span>{language.assetLicenseCheck}</span>
					<Checkbox checked={hasLicense} handleSelect={() => setHasLicense(!hasLicense)} disabled={false} />
				</S.CWrapper>
			</S.Header>
			<S.FlexWrapper>
				<S.SWrapper>
					<Select
						label={licenseParams.access.label}
						activeOption={accessFee}
						setActiveOption={(option: SelectOptionType) => setAccessFee(option)}
						options={[
							{ id: concatLicenseTag(licenseParams.access.options.none), label: licenseParams.access.options.none },
							{
								id: concatLicenseTag(licenseParams.access.options.oneTime),
								label: licenseParams.access.options.oneTime,
							},
						]}
						disabled={!hasLicense}
					/>
				</S.SWrapper>
				<S.IWrapper disabled={!accessFee || accessFee.id === concatLicenseTag(licenseParams.access.options.none)}>
					<FormField
						type={'number'}
						value={accessFeeAmount}
						onChange={(e: any) => setAccessFeeAmount(e.target.value)}
						invalid={{ status: accessFeeAmount < 0, message: null }}
						disabled={!accessFee || accessFee.id === concatLicenseTag(licenseParams.access.options.none) || !hasLicense}
						hideErrorMessage
					/>
					<ReactSVG src={ASSETS.u} />
				</S.IWrapper>
			</S.FlexWrapper>
			<S.FlexWrapper>
				<S.SSWrapper>
					<Select
						label={licenseParams.derivations.label}
						activeOption={derivations}
						setActiveOption={(option: SelectOptionType) => setDerivations(option)}
						options={[
							{
								id: concatLicenseTag(licenseParams.derivations.options.disallowed),
								label: licenseParams.derivations.options.disallowed,
							},
							{
								id: concatLicenseTag(licenseParams.derivations.options.allowed),
								label: licenseParams.derivations.options.allowed,
							},
						]}
						disabled={!hasLicense}
					/>
				</S.SSWrapper>
				<S.FlexFitWrapper>
					<S.SLWrapper>
						<Select
							label={language.terms}
							activeOption={derivationsTerm}
							setActiveOption={(option: SelectOptionType) => setDerivationsTerm(option)}
							options={[
								{
									id: concatLicenseTag(licenseParams.derivations.options.suboptions.credit),
									label: licenseParams.derivations.options.suboptions.credit,
								},
								{
									id: concatLicenseTag(licenseParams.derivations.options.suboptions.indication),
									label: licenseParams.derivations.options.suboptions.indication,
								},
								{
									id: concatLicenseTag(licenseParams.derivations.options.suboptions.licensePassthrough),
									label: licenseParams.derivations.options.suboptions.licensePassthrough,
								},
								{
									id: concatLicenseTag(licenseParams.derivations.options.suboptions.revenueShare),
									label: licenseParams.derivations.options.suboptions.revenueShare,
								},
								{
									id: concatLicenseTag(licenseParams.derivations.options.suboptions.monthlyFee),
									label: licenseParams.derivations.options.suboptions.monthlyFee,
								},
								{
									id: concatLicenseTag(licenseParams.derivations.options.suboptions.oneTimeFee),
									label: licenseParams.derivations.options.suboptions.oneTimeFee,
								},
							]}
							disabled={
								!derivations ||
								derivations.id === concatLicenseTag(licenseParams.derivations.options.disallowed) ||
								!hasLicense
							}
						/>
					</S.SLWrapper>
					{getDerivationsTermAmount()}
				</S.FlexFitWrapper>
			</S.FlexWrapper>
			<S.FlexWrapper>
				<S.SSWrapper>
					<Select
						label={licenseParams.commercialUse.label}
						activeOption={commercialUse}
						setActiveOption={(option: SelectOptionType) => setCommercialUse(option)}
						options={[
							{
								id: concatLicenseTag(licenseParams.commercialUse.options.disallowed),
								label: licenseParams.commercialUse.options.disallowed,
							},
							{
								id: concatLicenseTag(licenseParams.commercialUse.options.allowed),
								label: licenseParams.commercialUse.options.allowed,
							},
						]}
						disabled={!hasLicense}
					/>
				</S.SSWrapper>
				<S.FlexFitWrapper>
					<S.SLWrapper>
						<Select
							label={language.terms}
							activeOption={commercialUseTerm}
							setActiveOption={(option: SelectOptionType) => setCommercialUseTerm(option)}
							options={[
								{
									id: concatLicenseTag(licenseParams.commercialUse.options.suboptions.revenueShare),
									label: licenseParams.commercialUse.options.suboptions.revenueShare,
								},
								{
									id: concatLicenseTag(licenseParams.commercialUse.options.suboptions.monthlyFee),
									label: licenseParams.commercialUse.options.suboptions.monthlyFee,
								},
								{
									id: concatLicenseTag(licenseParams.commercialUse.options.suboptions.oneTimeFee),
									label: licenseParams.commercialUse.options.suboptions.oneTimeFee,
								},
							]}
							disabled={
								!commercialUse ||
								commercialUse.id === concatLicenseTag(licenseParams.commercialUse.options.disallowed) ||
								!hasLicense
							}
						/>
					</S.SLWrapper>
					{getCommercialUseTermAmount()}
				</S.FlexFitWrapper>
			</S.FlexWrapper>
			<S.FlexWrapper>
				<S.SSWrapper>
					<Select
						label={licenseParams.dataModelTraining.label}
						activeOption={dataModelTraining}
						setActiveOption={(option: SelectOptionType) => setDataModelTraining(option)}
						options={[
							{
								id: concatLicenseTag(licenseParams.dataModelTraining.options.disallowed),
								label: licenseParams.dataModelTraining.options.disallowed,
							},
							{
								id: concatLicenseTag(licenseParams.dataModelTraining.options.allowed),
								label: licenseParams.dataModelTraining.options.allowed,
							},
						]}
						disabled={!hasLicense}
					/>
				</S.SSWrapper>
				<S.FlexFitWrapper>
					<S.SLWrapper>
						<Select
							label={language.terms}
							activeOption={dataModelTrainingTerm}
							setActiveOption={(option: SelectOptionType) => setDataModelTrainingTerm(option)}
							options={[
								{
									id: concatLicenseTag(licenseParams.dataModelTraining.options.suboptions.monthlyFee),
									label: licenseParams.dataModelTraining.options.suboptions.monthlyFee,
								},
								{
									id: concatLicenseTag(licenseParams.dataModelTraining.options.suboptions.oneTimeFee),
									label: licenseParams.dataModelTraining.options.suboptions.oneTimeFee,
								},
							]}
							disabled={
								!dataModelTraining ||
								dataModelTraining.id === concatLicenseTag(licenseParams.dataModelTraining.options.disallowed) ||
								!hasLicense
							}
						/>
					</S.SLWrapper>
					{getDataModelTrainingTermAmount()}
				</S.FlexFitWrapper>
			</S.FlexWrapper>
			<S.FlexWrapper>
				<S.ASWrapper>
					<Select
						label={licenseParams.paymentMode.label}
						activeOption={paymentMode}
						setActiveOption={(option: SelectOptionType) => setPaymentMode(option)}
						options={[
							{
								id: concatLicenseTag(licenseParams.paymentMode.single),
								label: licenseParams.paymentMode.single,
							},
							{
								id: concatLicenseTag(licenseParams.paymentMode.random),
								label: licenseParams.paymentMode.random,
							},
							{
								id: concatLicenseTag(licenseParams.paymentMode.global),
								label: licenseParams.paymentMode.global,
							},
						]}
						disabled={!hasLicense}
					/>
				</S.ASWrapper>
				{getPaymentRecipient()}
			</S.FlexWrapper>
		</S.Wrapper>
	) : null;
}
