import Arweave from 'arweave';

import { API_CONFIG, GATEWAYS, STORAGE } from './config';
import { DateType, ProfileType } from './types';

export function checkAddress(address: string | null) {
	if (!address) return false;
	return /^[a-z0-9_-]{43}$/i.test(address);
}

export function getUniqueAddresses(addresses: string[]) {
	return Array.from(new Set(addresses));
}

export function formatAddress(address: string | null, wrap: boolean) {
	if (!address) return '';
	if (!checkAddress(address)) return address;
	const formattedAddress = address.substring(0, 5) + '...' + address.substring(36, address.length);
	return wrap ? `(${formattedAddress})` : formattedAddress;
}

export function formatDate(dateArg: string | number | null, dateType: DateType) {
	if (!dateArg) {
		return STORAGE.none;
	}

	let date: Date | null = null;

	switch (dateType) {
		case 'iso':
			date = new Date(dateArg);
			break;
		case 'epoch':
			date = new Date(Number(dateArg));
			break;
		default:
			date = new Date(dateArg);
			break;
	}

	return `${date.toLocaleString('default', {
		month: 'long',
	})} ${date.getDate()}, ${date.getUTCFullYear()}`;
}

export function getRelativeDate(timestamp: number) {
	const currentDate = new Date();
	const inputDate = new Date(timestamp);

	const timeDifference: number = currentDate.getTime() - inputDate.getTime();
	const secondsDifference = Math.floor(timeDifference / 1000);
	const minutesDifference = Math.floor(secondsDifference / 60);
	const hoursDifference = Math.floor(minutesDifference / 60);
	const daysDifference = Math.floor(hoursDifference / 24);
	const monthsDifference = Math.floor(daysDifference / 30.44); // Average days in a month
	const yearsDifference = Math.floor(monthsDifference / 12);

	if (yearsDifference > 0) {
		return `${yearsDifference} year${yearsDifference > 1 ? 's' : ''} ago`;
	} else if (monthsDifference > 0) {
		return `${monthsDifference} month${monthsDifference > 1 ? 's' : ''} ago`;
	} else if (daysDifference > 0) {
		return `${daysDifference} day${daysDifference > 1 ? 's' : ''} ago`;
	} else if (hoursDifference > 0) {
		return `${hoursDifference} hour${hoursDifference > 1 ? 's' : ''} ago`;
	} else if (minutesDifference > 0) {
		return `${minutesDifference} minute${minutesDifference > 1 ? 's' : ''} ago`;
	} else {
		return `${secondsDifference} second${secondsDifference !== 1 ? 's' : ''} ago`;
	}
}

export function getTagValue(list: { [key: string]: any }[], name: string): string {
	for (let i = 0; i < list.length; i++) {
		if (list[i]) {
			if (list[i]!.name === name) {
				return list[i]!.value as string;
			}
		}
	}
	return STORAGE.none;
}

export function log(message: any, _status: 0 | 1 | null): void {
	const now = new Date();
	const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');
	console.log(`${formattedDate} - ${message}`);
}

export function logValue(message: any, value: any, _status: 0 | 1 | null): void {
	const now = new Date();
	const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');
	console.log(`${formattedDate} - ${message} - ['${value}']`);
}

export function getCreatorLabel(creator: ProfileType) {
	if (!creator) return '-';
	if (creator.handle) return creator.handle;
	else return formatAddress(creator.walletAddress, false);
}

export function getByteSize(input: string | Buffer): number {
	let sizeInBytes: number;
	if (Buffer.isBuffer(input)) {
		sizeInBytes = input.length;
	} else if (typeof input === 'string') {
		sizeInBytes = Buffer.byteLength(input, 'utf-8');
	} else {
		throw new Error('Input must be a string or a Buffer');
	}

	return sizeInBytes;
}

export function getByteSizeDisplay(bytes: number) {
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	if (bytes === 0) return '0 Bytes';
	const i = Math.floor(Math.log(bytes) / Math.log(1000));
	return bytes / Math.pow(1000, i) + ' ' + sizes[i];
}

export function formatTime(time: number) {
	const hours = Math.floor(time / 3600);
	const minutes = Math.floor((time % 3600) / 60);
	const seconds = Math.floor(time % 60);

	const formattedHours = hours < 10 ? `${hours}` : hours.toString();
	const formattedMinutes = minutes < 10 ? `${hours > 0 ? '0' : ''}${minutes}` : minutes.toString();
	const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds.toString();

	return hours > 0
		? `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
		: `${formattedMinutes}:${formattedSeconds}`;
}

export function formatARAmount(amount: number) {
	return `${amount.toFixed(4)} AR`;
}

export function getTurboBalance(amount: number | string | null) {
	return amount !== null ? (typeof amount === 'string' ? amount : formatTurboAmount(amount)) : '**** Credits';
}

export function getARAmountFromWinc(amount: number) {
	const arweave = Arweave.init({
		host: GATEWAYS.arweave,
		protocol: API_CONFIG.protocol,
		port: API_CONFIG.port,
		timeout: API_CONFIG.timeout,
		logging: API_CONFIG.logging,
	});
	return Math.floor(+arweave.ar.winstonToAr(amount.toString()) * 1e6) / 1e6;
}

export function formatTurboAmount(amount: number) {
	return `${amount.toFixed(4)} Credits`;
}

export function formatUSDAmount(amount: number) {
	return `$ ${!amount || isNaN(amount) ? 0 : Number(amount).toFixed(2)}`;
}

export function formatRequiredField(field: string) {
	return `${field} *`;
}

export function getDataURLContentType(dataURL: string) {
	const result = dataURL.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
	return result ? result[1] : null;
}

export async function fileToBuffer(file: any) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = function (e: any) {
			const buffer = new Buffer(e.target.result);
			resolve(buffer);
		};
		reader.onerror = function (e: any) {
			reject(e);
		};
		reader.readAsArrayBuffer(file);
	});
}

export function getBase64Data(dataURL: string) {
	return dataURL.split(',')[1];
}

export function base64ToUint8Array(base64: any) {
	const binaryString = atob(base64);
	const len = binaryString.length;
	const bytes = new Uint8Array(len);
	for (let i = 0; i < len; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}
	return bytes;
}

export function concatLicenseTag(tag: string) {
	return tag.split(' ').join('-');
}

export function splitLicenseTag(tag: string) {
	return tag.split('-').join(' ');
}

export function getDisplayValue(value: string) {
	let result = value.replace(/([A-Z])/g, ' $1').trim();
	result = result.charAt(0).toUpperCase() + result.slice(1);
	return result;
}

export function stripFileExtension(fileName) {
	// Split the file name by dot
	const parts = fileName.split('.');

	// If there's no dot, return the original file name
	if (parts.length === 1) {
		return fileName;
	}

	// Remove the last part (extension) and join the remaining parts back together
	return parts.slice(0, -1).join('.');
}
