// import React from 'react';
// import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';
// import { useTheme } from 'styled-components';

// import { Button } from 'components/atoms/Button';
// import { FormField } from 'components/atoms/FormField';
// import { Loader } from 'components/atoms/Loader';
// import { Notification } from 'components/atoms/Notification';
// import { STRIPE_PUBLISHABLE_KEY, STYLING } from 'helpers/config';
// import { getTurboCheckoutEndpoint, getTurboPriceWincEndpoint } from 'helpers/endpoints';
// import { NotificationResponseType } from 'helpers/types';
// import { formatTurboAmount, formatUSDAmount, getARAmountFromWinc } from 'helpers/utils';
// import { useArweaveProvider } from 'providers/ArweaveProvider';
// import { useLanguageProvider } from 'providers/LanguageProvider';

// import { Modal } from '../Modal';

// import * as S from './styles';
// import { IProps } from './types';

// const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// function CheckoutForm(props: {
// 	handleGoBack: () => void;
// 	amount: number;
// 	wincConversion: number;
// 	currency: string;
// 	handleClose: () => void;
// }) {
// 	const stripe = useStripe();
// 	const elements = useElements();

// 	const arProvider = useArweaveProvider();

// 	const languageProvider = useLanguageProvider();
// 	const language = languageProvider.object[languageProvider.current];

// 	const [loading, setLoading] = React.useState<boolean>(false);
// 	const [result, setResult] = React.useState<NotificationResponseType | null>(null);

// 	const [mounting, setMounting] = React.useState<boolean>(true);

// 	React.useEffect(() => {
// 		(async function () {
// 			await new Promise((r) => setTimeout(r, 500));
// 			setMounting(false);
// 		})();
// 	}, []);

// 	async function handleSubmit(e: any) {
// 		e.preventDefault();
// 		setLoading(true);
// 		if (!stripe || !elements) {
// 			return;
// 		}
// 		try {
// 			if (arProvider.walletAddress) {
// 				const paymentResponse = await stripe.confirmPayment({
// 					elements,
// 					confirmParams: {
// 						return_url: `https://helix.arweave.net`,
// 					},
// 					redirect: 'if_required',
// 				});

// 				if (paymentResponse.error) {
// 					console.error(paymentResponse.error.message);
// 				} else {
// 					if (paymentResponse && paymentResponse.paymentIntent && paymentResponse.paymentIntent.status) {
// 						if (paymentResponse.paymentIntent.status === 'succeeded') {
// 							setResult({ status: true, message: language.successfullyFunded });
// 						} else {
// 							setResult({ status: false, message: language.errorOccurred });
// 						}
// 					}
// 				}
// 			}
// 		} catch (e: any) {
// 			console.error(e);
// 		}
// 		setLoading(false);
// 	}

// 	return (
// 		<>
// 			<S.CheckoutForm disabled={loading || result !== null}>
// 				{mounting ? <Loader sm relative /> : <PaymentElement options={{ layout: 'accordion' }} />}
// 			</S.CheckoutForm>
// 			<S.COWrapperAlt className={'border-wrapper-alt1'}>
// 				<S.COHeader>
// 					<span>{language.amount}</span>
// 				</S.COHeader>
// 				<span>{`${formatUSDAmount(props.amount)} = ${formatTurboAmount(props.wincConversion)}`}</span>
// 			</S.COWrapperAlt>
// 			<S.MActions>
// 				<Button
// 					type={'primary'}
// 					label={language.back}
// 					handlePress={props.handleGoBack}
// 					disabled={loading || result !== null}
// 					noMinWidth
// 				/>
// 				<Button
// 					type={'alt1'}
// 					label={language.submit}
// 					handlePress={handleSubmit}
// 					disabled={loading || result !== null}
// 					loading={loading}
// 					formSubmit
// 					noMinWidth
// 				/>
// 			</S.MActions>
// 			{result && (
// 				<Notification
// 					message={result.message!}
// 					callback={() => {
// 						setResult(null);
// 						props.handleClose();
// 					}}
// 				/>
// 			)}
// 		</>
// 	);
// }

// export default function TurboBalanceFund(props: IProps) {
// 	const theme = useTheme();

// 	const arProvider = useArweaveProvider();
// 	const languageProvider = useLanguageProvider();
// 	const language = languageProvider.object[languageProvider.current];

// 	const [checkout, setCheckout] = React.useState<any>(null);
// 	const [checkoutStep, setCheckoutStep] = React.useState<'amount' | 'payment'>('amount');
// 	const [clientSecret, setClientSecret] = React.useState<string>('');

// 	const [currency, _setCurrency] = React.useState<string>('usd');
// 	const [amount, setAmount] = React.useState<number>(0);
// 	const [customAmount, setCustomAmount] = React.useState<number>(0);

// 	const [wincConversion, setWincConversion] = React.useState<number>(0);
// 	const [fetchingConversion, setFetchingConversion] = React.useState<boolean>(false);

// 	// React.useEffect(() => {
// 	// 	(async function () {
// 	// 		if (currency && amount) {
// 	// 			setFetchingConversion(true);
// 	// 			try {
// 	// 				const priceResponse = await fetch(getTurboPriceWincEndpoint(currency, amount));
// 	// 				if (priceResponse.ok) {
// 	// 					const price = await priceResponse.json();
// 	// 					setWincConversion(getARAmountFromWinc(price.winc ? price.winc : 0));
// 	// 				}
// 	// 			} catch (e: any) {
// 	// 				console.error(e);
// 	// 			}
// 	// 			setFetchingConversion(false);
// 	// 		}
// 	// 	})();
// 	// }, [amount]);

// 	React.useEffect(() => {
// 		if (customAmount) setAmount(Number(customAmount));
// 	}, [customAmount]);

// 	// TODO
// 	// React.useEffect(() => {
// 	// 	(async function () {
// 	// 		if (checkoutStep === 'payment' && amount && !getInvalidAmount().status && currency && arProvider.walletAddress) {
// 	// 			try {
// 	// 				const checkoutResponse = await fetch(getTurboCheckoutEndpoint(arProvider.walletAddress, currency, amount));
// 	// 				if (checkoutResponse.ok) {
// 	// 					const checkoutResponseJson = await checkoutResponse.json();
// 	// 					setCheckout(checkoutResponseJson);
// 	// 					setClientSecret(checkoutResponseJson.paymentSession.client_secret);
// 	// 				}
// 	// 			} catch (e: any) {
// 	// 				console.error(e);
// 	// 			}
// 	// 		}
// 	// 	})();
// 	// }, [arProvider.walletAddress, checkoutStep]);

// 	function getInvalidAmount() {
// 		if (amount && (amount < 5 || amount > 10000)) return { status: true, message: language.invalidAmountTurbo };
// 		return { status: false, message: null };
// 	}

// 	const DEFAULT_AMOUNTS = [5, 10, 25, 50, 75];

// 	function handleGoBack() {
// 		setCheckout(null);
// 		setCheckoutStep('amount');
// 	}

// 	function getCheckoutStep() {
// 		switch (checkoutStep) {
// 			case 'amount':
// 				return (
// 					<S.MWrapper>
// 						<S.MInfo>
// 							<p>{language.fundTurboBalanceInfoHeader}</p>
// 							<span>{language.fundTurboBalanceInfoDetail}</span>
// 						</S.MInfo>
// 						<S.DWrapper>
// 							<S.DHeader>
// 								<span>{language.amount}</span>
// 							</S.DHeader>
// 							<S.DElements>
// 								{DEFAULT_AMOUNTS.map((defaultAmount: number, index: number) => {
// 									return (
// 										<Button
// 											key={index}
// 											type={'primary'}
// 											label={formatUSDAmount(defaultAmount)}
// 											handlePress={() => {
// 												setAmount(defaultAmount);
// 												setCustomAmount(0);
// 											}}
// 											active={Number(defaultAmount) === Number(amount)}
// 											height={40}
// 											width={125}
// 										/>
// 									);
// 								})}
// 							</S.DElements>
// 						</S.DWrapper>
// 						<S.CWrapper>
// 							<FormField
// 								label={`${language.customAmount} (${language.customAmountTurboInfo})`}
// 								type={'number'}
// 								value={customAmount}
// 								onChange={(e: any) => setCustomAmount(e.target.value)}
// 								disabled={false}
// 								invalid={getInvalidAmount()}
// 							/>
// 						</S.CWrapper>
// 						<S.COWrapper className={'border-wrapper-alt1'}>
// 							<S.COHeader>
// 								<span>{language.conversion}</span>
// 							</S.COHeader>
// 							<span>
// 								{fetchingConversion
// 									? `${language.fetching}...`
// 									: `${formatUSDAmount(amount)} = ${formatTurboAmount(wincConversion)}`}
// 							</span>
// 						</S.COWrapper>
// 						<S.MActions>
// 							<Button
// 								type={'primary'}
// 								label={language.cancel}
// 								handlePress={props.handleClose}
// 								disabled={false}
// 								noMinWidth
// 							/>
// 							<Button
// 								type={'alt1'}
// 								label={language.next}
// 								handlePress={() => setCheckoutStep('payment')}
// 								disabled={amount <= 0 || getInvalidAmount().status || !currency || !arProvider.walletAddress}
// 								loading={false}
// 								formSubmit
// 								noMinWidth
// 							/>
// 						</S.MActions>
// 					</S.MWrapper>
// 				);
// 			case 'payment':
// 				if (checkout && checkout.paymentSession && clientSecret) {
// 					return (
// 						<S.MWrapper>
// 							<S.MInfo>
// 								<p>{language.fundTurboPaymentHeader}</p>
// 								<span>{language.fundTurboPaymentDetail}</span>
// 							</S.MInfo>
// 							<Elements
// 								stripe={stripePromise}
// 								options={{
// 									clientSecret: clientSecret,
// 									appearance: {
// 										theme: 'stripe',
// 										variables: {
// 											colorBackground: theme.colors.container.primary.background,
// 											colorPrimary: theme.colors.font.alt5,
// 											colorText: theme.colors.font.primary,
// 											fontSizeBase: theme.typography.size.small,
// 											fontWeightLight: theme.typography.weight.medium,
// 											fontWeightNormal: theme.typography.weight.medium,
// 											fontWeightMedium: theme.typography.weight.medium,
// 											fontWeightBold: theme.typography.weight.medium,
// 											borderRadius: STYLING.dimensions.radius.primary,
// 											spacingUnit: '4.5px',
// 										},
// 									},
// 								}}
// 							>
// 								<CheckoutForm
// 									handleGoBack={handleGoBack}
// 									wincConversion={wincConversion}
// 									currency={currency}
// 									amount={amount}
// 									handleClose={props.handleClose}
// 								/>
// 							</Elements>
// 						</S.MWrapper>
// 					);
// 				} else {
// 					return (
// 						<S.LWrapper>
// 							<Loader sm relative />
// 						</S.LWrapper>
// 					);
// 				}
// 		}
// 	}

// 	return arProvider.wallet ? (
// 		<>
// 			<Modal header={language.fundTurboBalance} handleClose={props.handleClose}>
// 				{getCheckoutStep()}
// 			</Modal>
// 		</>
// 	) : null;
// }

export default function TurboBalanceFund(props: any) {
	return null;
}
