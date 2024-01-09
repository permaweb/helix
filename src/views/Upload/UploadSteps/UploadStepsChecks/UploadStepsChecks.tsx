import React from 'react';
import { useSelector } from 'react-redux';

import { getLicenseValuePayment } from 'gql';

import { Button } from 'components/atoms/Button';
import { AssetInfoLicense } from 'components/molecules/AssetInfoLicense';
import { Modal } from 'components/molecules/Modal';
import { TurboBalanceFund } from 'components/molecules/TurboBalanceFund';
import { ASSETS, TAGS } from 'helpers/config';
import { formatTurboAmount, getTurboBalance } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useLanguageProvider } from 'providers/LanguageProvider';
import { RootState } from 'store';

import * as S from './styles';

export default function UploadStepsChecks() {
	const uploadReducer = useSelector((state: RootState) => state.uploadReducer);

	const arProvider = useArweaveProvider();

	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	const videoRef = React.useRef(null);

	const [showPlayer, setShowPlayer] = React.useState<boolean>(false);
	const [videoSrc, setVideoSrc] = React.useState('');

	const [showFund, setShowFund] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (showPlayer && uploadReducer.data.content) {
			const url = URL.createObjectURL(uploadReducer.data.content);
			setVideoSrc(url);
		}
	}, [showPlayer, uploadReducer.data.content]);

	return (
		<>
			<S.Wrapper>
				<S.InfoHeader>
					<span>{language.details}</span>
					<Button
						type={'alt2'}
						label={language.previewContent}
						handlePress={() => setShowPlayer(true)}
						disabled={!uploadReducer.data.content}
					/>
				</S.InfoHeader>
				<S.InfoWrapper className={'border-wrapper-alt1'}>
					<S.InfoLine>
						<span>{language.title}</span>
						<p>{uploadReducer.data.title ?? '-'}</p>
					</S.InfoLine>
					<S.InfoLine>
						<span>{language.description}</span>
						<p>{uploadReducer.data.description ?? '-'}</p>
					</S.InfoLine>
					{/* {uploadReducer.data.topics && uploadReducer.data.topics.length && (
						<S.InfoLine>
							<span>{language.topics}</span>
							<S.TWrapper>
								{uploadReducer.data.topics.map((topic: string, index: number) => {
									return (
										<p key={index}>
											{topic.charAt(0).toUpperCase() + topic.slice(1)}
											{!(index === uploadReducer.data.topics.length - 1) && ',\u00A0'}
										</p>
									);
								})}
							</S.TWrapper>
						</S.InfoLine>
					)} */}
				</S.InfoWrapper>
				{uploadReducer.data.hasLicense && (
					<AssetInfoLicense
						asset={{
							id: '',
							contentType: '',
							contentLength: 0,
							title: '',
							description: '',
							type: '',
							topics: [''],
							creator: null,
							dateCreated: 0,
							thumbnail: '',
							license: {
								license: TAGS.values.license,
								access: {
									value: `${uploadReducer.data.license.accessFee.value}-${uploadReducer.data.license.accessFee.amount}`,
									icon: ASSETS.u,
								},
								derivations: getLicenseValuePayment(
									`${uploadReducer.data.license.derivations.value}-${uploadReducer.data.license.derivations.terms.value}-${uploadReducer.data.license.derivations.terms.amount}`
								),
								commercialUse: getLicenseValuePayment(
									`${uploadReducer.data.license.commercialUse.value}-${uploadReducer.data.license.commercialUse.terms.value}-${uploadReducer.data.license.commercialUse.terms.amount}`
								),
								dataModelTraining: getLicenseValuePayment(
									`${uploadReducer.data.license.dataModelTraining.value}-${uploadReducer.data.license.dataModelTraining.terms.value}-${uploadReducer.data.license.dataModelTraining.terms.amount}`
								),
								paymentMode: uploadReducer.data.license.paymentMode.value,
								paymentAddress: uploadReducer.data.license.paymentMode.recipient,
							},
						}}
					/>
				)}
				<S.InfoHeader>
					<span>{language.paymentInformation}</span>
				</S.InfoHeader>
				<S.InfoWrapper className={'border-wrapper-alt1'}>
					<S.InfoLine>
						<span>{language.turboUploadCost}</span>
						<p>
							{uploadReducer.uploadCost > 0
								? formatTurboAmount(uploadReducer.uploadCost)
								: language.uploadChecksCostInfo}
						</p>
					</S.InfoLine>
					<S.InfoLine>
						<S.InfoLineFlex>
							<span>{language.yourBalance}</span>
							{arProvider.turboBalance === null && (
								<Button
									type={'alt2'}
									label={`(${language.fetch})`}
									handlePress={() => arProvider.getTurboBalance()}
									disabled={arProvider.turboBalance !== null}
									height={22.5}
									noMinWidth
								/>
							)}
							<Button
								type={'alt2'}
								label={language.fund}
								handlePress={() => setShowFund(true)}
								height={22.5}
								noMinWidth
							/>
						</S.InfoLineFlex>
						<p>
							{arProvider.turboBalance !== null
								? getTurboBalance(arProvider.turboBalance)
								: language.uploadChecksCostTurboInfo}
						</p>
					</S.InfoLine>
				</S.InfoWrapper>
			</S.Wrapper>
			{showPlayer && uploadReducer.data.content && (
				<Modal header={language.previewContent} handleClose={() => setShowPlayer(false)}>
					<S.MWrapper>
						<video ref={videoRef} src={videoSrc} controls autoPlay />
					</S.MWrapper>
				</Modal>
			)}
			{showFund && <TurboBalanceFund handleClose={() => setShowFund(false)} />}
		</>
	);
}
