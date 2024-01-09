import React from 'react';

import { Button } from 'components/atoms/Button';
import { FormField } from 'components/atoms/FormField';
import { Loader } from 'components/atoms/Loader';
import { getTurboCheckoutEndpoint, getTurboPriceWincEndpoint } from 'helpers/endpoints';
import { formatTurboAmount, formatUSDAmount, getARAmountFromWinc } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useLanguageProvider } from 'providers/LanguageProvider';

import { Modal } from '../Modal';

import * as S from './styles';
import { IProps } from './types';

export default function TurboBalanceFund(props: IProps) {
	const arProvider = useArweaveProvider();
	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	const [checkout, setCheckout] = React.useState<any>(null);
	const [checkoutStep, setCheckoutStep] = React.useState<'amount' | 'payment'>('amount');

	const [currency, _setCurrency] = React.useState<string>('usd');
	const [amount, setAmount] = React.useState<number>(0);
	const [customAmount, setCustomAmount] = React.useState<number>(0);

	const [wincConversion, setWincConversion] = React.useState<number>(0);
	const [fetchingConversion, setFetchingConversion] = React.useState<boolean>(false);

	React.useEffect(() => {
		(async function () {
			if (currency && amount) {
				setFetchingConversion(true);
				try {
					const priceResponse = await fetch(getTurboPriceWincEndpoint(currency, amount));
					if (priceResponse.ok) {
						const price = await priceResponse.json();
						setWincConversion(getARAmountFromWinc(price.winc ? price.winc : 0));
					}
				} catch (e: any) {
					console.error(e);
				}
				setFetchingConversion(false);
			}
		})();
	}, [amount]);

	React.useEffect(() => {
		if (customAmount) setAmount(Number(customAmount));
	}, [customAmount]);

	React.useEffect(() => {
		(async function () {
			if (checkoutStep === 'payment' && amount && !getInvalidAmount().status && currency && arProvider.walletAddress) {
				try {
					const checkoutResponse = await fetch(getTurboCheckoutEndpoint(arProvider.walletAddress, currency, amount));
					if (checkoutResponse.ok) {
						setCheckout(await checkoutResponse.json());
					}
				} catch (e: any) {
					console.error(e);
				}
			}
		})();
	}, [checkoutStep]);

	function getInvalidAmount() {
		if (amount && (amount < 5 || amount > 10000)) return { status: true, message: language.invalidAmountTurbo };
		return { status: false, message: null };
	}

	const DEFAULT_AMOUNTS = [10, 25, 50, 75];

	function handleGoBack() {
		setCheckout(null);
		setCheckoutStep('amount');
	}

	function getCheckoutStep() {
		switch (checkoutStep) {
			case 'amount':
				return (
					<S.MWrapper>
						<S.MInfo>
							<p>{language.fundTurboBalanceInfoHeader}</p>
							<span>{language.fundTurboBalanceInfoDetail}</span>
						</S.MInfo>
						<S.DWrapper>
							<S.DHeader>
								<span>{language.amount}</span>
							</S.DHeader>
							<S.DElements>
								{DEFAULT_AMOUNTS.map((defaultAmount: number, index: number) => {
									return (
										<Button
											key={index}
											type={'primary'}
											label={formatUSDAmount(defaultAmount)}
											handlePress={() => {
												setAmount(defaultAmount);
												setCustomAmount(0);
											}}
											active={Number(defaultAmount) === Number(amount)}
											height={40}
											width={125}
										/>
									);
								})}
							</S.DElements>
						</S.DWrapper>
						<S.CWrapper>
							<FormField
								label={`${language.customAmount} (${language.customAmountTurboInfo})`}
								type={'number'}
								value={customAmount}
								onChange={(e: any) => setCustomAmount(e.target.value)}
								disabled={false}
								invalid={getInvalidAmount()}
							/>
						</S.CWrapper>
						<S.COWrapper className={'border-wrapper-alt1'}>
							<S.COHeader>
								<span>{language.conversion}</span>
							</S.COHeader>
							<span>
								{fetchingConversion
									? `${language.fetching}...`
									: `${formatUSDAmount(amount)} = ${formatTurboAmount(wincConversion)}`}
							</span>
						</S.COWrapper>
						<S.MActions>
							<Button
								type={'primary'}
								label={language.cancel}
								handlePress={props.handleClose}
								disabled={false}
								noMinWidth
							/>
							<Button
								type={'alt1'}
								label={language.next}
								handlePress={() => setCheckoutStep('payment')}
								disabled={amount <= 0 || getInvalidAmount().status || !currency || !arProvider.walletAddress}
								loading={false}
								formSubmit
								noMinWidth
							/>
						</S.MActions>
					</S.MWrapper>
				);
			case 'payment':
				if (checkout && checkout.paymentSession && checkout.paymentSession.url) {
					return (
						<S.MWrapper>
							<S.MInfo>
								<p>{language.fundTurboPaymentHeader}</p>
								<span>{language.fundTurboPaymentDetail}</span>
							</S.MInfo>
							<S.DWrapper>
								<S.DHeader>
									<span>{`${language.amount}: ${formatUSDAmount(amount)}`}</span>
								</S.DHeader>
							</S.DWrapper>
							<S.COWrapperAlt className={'border-wrapper-alt1'}>
								<S.COHeader>
									<span>{language.conversion}</span>
								</S.COHeader>
								<span>
									{fetchingConversion
										? `${language.fetching}...`
										: `${formatUSDAmount(amount)} = ${formatTurboAmount(wincConversion)}`}
								</span>
							</S.COWrapperAlt>
							<S.MActions>
								<Button type={'primary'} label={language.back} handlePress={handleGoBack} disabled={false} noMinWidth />
								<Button
									type={'alt1'}
									label={language.goToPayment}
									handlePress={() => window.open(checkout.paymentSession.url, '_blank')}
									disabled={false}
									loading={false}
									formSubmit
									noMinWidth
								/>
							</S.MActions>
						</S.MWrapper>
					);
				} else {
					return (
						<S.LWrapper>
							<Loader sm relative />
						</S.LWrapper>
					);
				}
		}
	}

	return arProvider.wallet ? (
		<>
			<Modal header={language.fundTurboBalance} handleClose={props.handleClose}>
				{getCheckoutStep()}
			</Modal>
		</>
	) : null;
}
