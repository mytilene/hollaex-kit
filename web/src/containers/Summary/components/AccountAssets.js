import React from 'react';
import classnames from 'classnames';
import { isMobile } from 'react-device-detect';
import { Link } from 'react-router';

import { DonutChart, Carousel, EditWrapper, NotLoggedIn } from 'components';
import STRINGS from 'config/localizedStrings';
import {
	BASE_CURRENCY,
	DEFAULT_COIN_DATA,
	SHOW_TOTAL_ASSETS,
	SHOW_SUMMARY_ACCOUNT_DETAILS,
} from 'config/constants';
import { formatToCurrency } from 'utils/currency';
import { isLoggedIn } from 'utils/token';
import AssetCard from './AssetCard';

const AccountAssets = ({ chartData = [], totalAssets, balance, coins }) => {
	const baseValue = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
	const assetCards = () => {
		if (!chartData.length) {
			let chartLoading = [];
			for (var i = 1; i <= 8; i++) {
				chartLoading.push(
					<div>
						<div
							className="dot-flashing"
							style={{ animationDelay: `.${i}s` }}
						></div>
					</div>
				);
			}
			return chartLoading;
		} else {
			return chartData.map((value, index) => {
				const { min, display_name } =
					coins[value.symbol || BASE_CURRENCY] || {};
				let currencyBalance = formatToCurrency(
					balance[`${value.symbol}_balance`],
					min
				);
				return (
					<AssetCard
						key={index}
						value={value}
						name={display_name}
						currencyBalance={currencyBalance}
						hideBalance={!isLoggedIn()}
					/>
				);
			});
		}
	};

	return (
		<div>
			<div className="summary-content-txt assets-description">
				<div className={isMobile ? '' : 'd-flex mb-2'}>
					<EditWrapper stringId="SUMMARY.ACCOUNT_ASSETS_TXT_1">
						{STRINGS['SUMMARY.ACCOUNT_ASSETS_TXT_1']}
					</EditWrapper>
					<Link to="/wallet/deposit">
						<div className="trade-account-link ml-1">
							<EditWrapper stringId="SUMMARY.MAKE_A_DEPOSIT">
								{STRINGS['SUMMARY.MAKE_A_DEPOSIT']}
							</EditWrapper>
						</div>
					</Link>
				</div>
				<div className={isMobile ? '' : 'd-flex mb-3'}>
					<Link to="/wallet/volume">
						<div className="trade-account-link ml-1">
							<EditWrapper stringId="VOLUME.TRADE_DESCRIPTION">
								{STRINGS['VOLUME.TRADE_DESCRIPTION']}
							</EditWrapper>
						</div>
					</Link>
				</div>
				{SHOW_SUMMARY_ACCOUNT_DETAILS ? (
					<div>
						<EditWrapper stringId="SUMMARY.ACCOUNT_ASSETS_TXT_2">
							{STRINGS['SUMMARY.ACCOUNT_ASSETS_TXT_2']}
						</EditWrapper>
					</div>
				) : null}
			</div>
			<div className="d-flex align-items-center justify-content-center h-100">
				<div
					className={classnames({
						'w-75': !SHOW_SUMMARY_ACCOUNT_DETAILS && !isMobile,
						'w-100': isMobile,
					})}
				>
					<div className="d-flex justify-content-end">
						<EditWrapper stringId="ZERO_ASSET,DEPOSIT_ASSETS,OPEN_WALLET" />
					</div>
					<NotLoggedIn hasBackground={false}>
						<div
							className={classnames('w-100 donut-container mb-4', {
								'd-flex align-items-center justify-content-center loading-wrapper': !chartData.length,
							})}
						>
							{chartData.length ? (
								<DonutChart coins={coins} chartData={chartData} />
							) : (
								<div>
									<div className="rounded-loading">
										<div className="inner-round" />
									</div>
									<div className="loading-txt caps">
										<EditWrapper stringId="WALLET.LOADING_ASSETS">
											{STRINGS['WALLET.LOADING_ASSETS']}
										</EditWrapper>
									</div>
								</div>
							)}
						</div>
					</NotLoggedIn>
					<Carousel
						items={assetCards()}
						groupItems={isMobile ? 4 : 7}
						isActive={true}
						isPositionChange={true}
					/>
				</div>
			</div>
			{SHOW_TOTAL_ASSETS ? (
				<div className="text-center my-3 title-font">
					<span className="total-assets">
						{STRINGS.formatString(
							STRINGS['TOTAL_ASSETS_VALUE'],
							baseValue.fullname,
							totalAssets
						)}
					</span>
				</div>
			) : null}
		</div>
	);
};

export default AccountAssets;
