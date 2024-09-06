import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { Button, Checkbox, message } from 'antd';
import { RightOutlined } from '@ant-design/icons';

import './_P2P.scss';
import classnames from 'classnames';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import NoDealsData from './Utilis';
import { Coin, EditWrapper } from 'components';
import { fetchDeals, editDeal, removeDeal } from './actions/p2pActions';
import { formatToCurrency } from 'utils/currency';

const P2PMyDeals = ({
	data,
	onClose,
	coins,
	pairs,
	constants = {},
	icons: ICONS,
	transaction_limits,
	tiers = {},
	user,
	refresh,
	setSelectedDealEdit,
	setTab,
}) => {
	const [myDeals, setMyDeals] = useState([]);
	const [checks, setCheks] = useState([]);
	useEffect(() => {
		fetchDeals({ user_id: user.id })
			.then((res) => {
				setMyDeals(res.data);
			})
			.catch((err) => err);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refresh]);

	const formatAmount = (currency, amount) => {
		const min = coins[currency].min;
		const formattedAmount = formatToCurrency(amount, min);
		return formattedAmount;
	};

	const formatRate = (rate, spread, asset, side) => {
		const amount =
			side === 'sell'
				? rate * (1 + Number(spread / 100 || 0))
				: rate * (1 - Number(spread / 100 || 0));
		return formatAmount(asset, amount);
	};

	return (
		<div
			className={classnames(
				...[
					'P2pOrder',
					myDeals?.length > 0
						? 'p2p-mydeals-wrapper w-100'
						: 'p2p-mydeals-wrapper w-100 p2p-no-deals-container',
					isMobile ? 'mobile-view-p2p' : '',
				]
			)}
		>
			<div className="p2p-mydeals-content-wrapper">
				<span>
					<Checkbox
						onChange={(e) => {
							if (e.target.checked) {
								setCheks(myDeals.map((deal) => deal.id));
							} else {
								setCheks([]);
							}
						}}
						className="whiteTextP2P"
					>
						{myDeals.length === 0 ? (
							<EditWrapper stringId="P2P.NO_DEALS">
								{STRINGS['P2P.NO_DEALS']}
							</EditWrapper>
						) : (
							<EditWrapper stringId="P2P.NUM_DEALS">
								{myDeals.length} {STRINGS['P2P.NUM_DEALS']}
							</EditWrapper>
						)}
					</Checkbox>
				</span>
				<span>
					<Button
						className="purpleButtonP2P"
						onClick={async () => {
							try {
								await editDeal({
									edited_ids: checks,
									status: true,
								});
								const res = await fetchDeals({ user_id: user.id });
								setMyDeals(res.data);
								setCheks([]);
								message.success(STRINGS['P2P.CHANGES_SAVED']);
							} catch (error) {
								message.error(error.message);
							}
						}}
					>
						<EditWrapper stringId="P2P.ACTIVATE">
							{STRINGS['P2P.ACTIVATE']}
						</EditWrapper>
					</Button>
				</span>
				<span>
					<Button
						className="purpleButtonP2P"
						onClick={async () => {
							try {
								await editDeal({
									edited_ids: checks,
									status: false,
								});
								const res = await fetchDeals({ user_id: user.id });
								setMyDeals(res.data);
								setCheks([]);
								message.success(STRINGS['P2P.CHANGES_SAVED']);
							} catch (error) {
								message.error(error.message);
							}
						}}
					>
						<EditWrapper stringId="P2P.TAKE_OFFLINE">
							{STRINGS['P2P.TAKE_OFFLINE']}
						</EditWrapper>
					</Button>
				</span>
				<span>
					<Button
						className="purpleButtonP2P"
						onClick={async () => {
							try {
								await removeDeal({
									removed_ids: checks,
									status: false,
								});
								setMyDeals(myDeals.filter((deal) => !checks.includes(deal.id)));
								setCheks([]);
								message.success(STRINGS['P2P.CHANGES_SAVED']);
							} catch (error) {
								message.error(error.message);
							}
						}}
					>
						<EditWrapper stringId="P2P.REMOVE">
							{STRINGS['P2P.REMOVE']}
						</EditWrapper>
					</Button>
				</span>
			</div>
			<div className="p2p-mydeals-table-wrapper">
				{myDeals?.length > 0 ? (
					<table className="p2p-mydeals-table-content-wrapper important-text w-100">
						<thead className="secondary-text">
							<tr className="table-bottom-border">
								<th></th>
								<th>
									<EditWrapper stringId="P2P.SIDE">
										{STRINGS['P2P.SIDE']}
									</EditWrapper>
								</th>
								<th>
									<EditWrapper stringId="P2P.STATUS">
										{STRINGS['P2P.STATUS']}
									</EditWrapper>
								</th>
								<th>
									<EditWrapper stringId="P2P.PRICE_DISPLAYED">
										{STRINGS['P2P.PRICE_DISPLAYED']}
									</EditWrapper>
								</th>
								<th>
									<EditWrapper stringId="P2P.LIMIT_AVAILABLE">
										{STRINGS['P2P.LIMIT_AVAILABLE']}
									</EditWrapper>
								</th>
								<th>
									<EditWrapper stringId="P2P.PAYMENT">
										{STRINGS['P2P.PAYMENT']}
									</EditWrapper>
								</th>
								<th>
									<EditWrapper stringId="P2P.EDIT_DEAL">
										{STRINGS['P2P.EDIT_DEAL']}
									</EditWrapper>
								</th>
							</tr>
						</thead>
						<tbody>
							{myDeals.map((deal) => {
								return (
									<tr className="table-row">
										<td className="td-fit w-fit-content">
											<Checkbox
												checked={checks.find((id) => id === deal.id)}
												onChange={(e) => {
													if (e.target.checked) {
														if (!checks.find((id) => id === deal.id))
															setCheks([...checks, deal.id]);
													} else {
														setCheks(checks.filter((id) => id !== deal.id));
													}
												}}
											/>
										</td>
										<td
											className={`td-fit w-fit-content ${
												deal.side === 'sell' ? 'sellSideP2P' : 'buySideP2P'
											}`}
										>
											<Button className="text-capitalize">{deal.side} </Button>
										</td>
										<td className="td-fit w-fit-content">
											{deal.status ? (
												<EditWrapper stringId="P2P.ACTIVE">
													{STRINGS['P2P.ACTIVE']}
												</EditWrapper>
											) : (
												<EditWrapper stringId="P2P.INACTIVE">
													{STRINGS['P2P.INACTIVE']}
												</EditWrapper>
											)}
										</td>
										<td className="td-fit w-fit-content fs-">
											<span className="font-weight-bold fs-16">{` ${formatRate(
												deal.exchange_rate,
												deal.spread,
												deal.spending_asset,
												deal.side
											)}`}</span>{' '}
											{deal.spending_asset.toUpperCase()}
										</td>
										<td className="td-fit w-fit-content">
											<div className="mt-3 mb-2 avaliable-amount-detail">
												<span className="secondary-text-inactive">
													<EditWrapper stringId="P2P.AVAILABLE">
														{STRINGS['P2P.AVAILABLE']}
													</EditWrapper>
													:
												</span>
												<span>{deal.total_order_amount}</span>
												<span>{deal.buying_asset.toUpperCase()}</span>
												<Coin
													iconId={coins[deal?.buying_asset]?.icon_id}
													type="CS4"
												/>
											</div>
											<div>
												<span className="secondary-text-inactive">
													<EditWrapper stringId="P2P.LIMIT">
														{STRINGS['P2P.LIMIT']}
													</EditWrapper>
													:
												</span>{' '}
												{`${deal.min_order_value} - ${deal.max_order_value}`}{' '}
												{deal.spending_asset.toUpperCase()}
											</div>
										</td>
										<td className="w-fit-content pay-methods mt-2">
											{deal.payment_methods
												.map((method) => method.system_name)
												.join(', ')}
										</td>
										<td className="td-fit w-fit-content">
											<Button
												onClick={() => {
													setSelectedDealEdit(deal);
													setTab('3');
												}}
												ghost
												className="whiteTextP2P edit-deal-btn"
											>
												<EditWrapper stringId="P2P.EDIT_DEAL_BUTTON">
													{STRINGS['P2P.EDIT_DEAL_BUTTON']}
												</EditWrapper>
												<RightOutlined />
											</Button>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				) : (
					<NoDealsData />
				)}
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	pairs: state.app.pairs,
	coins: state.app.coins,
	constants: state.app.constants,
	transaction_limits: state.app.transaction_limits,
	user: state.user,
});

export default connect(mapStateToProps)(withConfig(P2PMyDeals));
