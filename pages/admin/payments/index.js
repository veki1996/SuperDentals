import { SideBar, Table, ColumnFilter } from '/components';
import { CSVLink } from 'react-csv';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { prisma } from '/utils/db';

const SubscriberPackages = ({ payments }) => {
	const router = useRouter();
	// States
	const [downloadSubscriptionPackages, setDownloadSubscriptionPackages] = useState([]);
	const [showAllPayments, setShowAllPayments] = useState(false);
	const handleDiscounts = (payment) => {
		const discounts = JSON.parse(payment?.discounts);
		const globalDiscount = discounts?.find((discount) => discount?.type === 'GlobalDiscount');
		const promoDiscount = discounts?.find((discount) => discount?.type === 'PromoCode');
		const referralDiscount = discounts?.find((discount) => discount?.type === 'ReferralCode');

		return (
			<span className="flex flex-col">
				<div>Global Discount: {globalDiscount?.discountValue || 0}%</div>
				<div>Promo Discount: {promoDiscount?.discountValue || 0}%</div>
				<div>Referral Discount: {referralDiscount?.discountValue || 0}%</div>
			</span>
		);
	};

	const data = useMemo(
		() =>
			payments
				.filter((payment) => payment.user || showAllPayments)
				.map((payment) => ({
					id: payment?.id,
					user: `${payment?.user ? `${payment?.user?.name} ${payment?.user?.surname}` : 'Deleted User'}`,
					subscriptionId: payment.subscriptionId,
					transactionId: payment.transactionId,
					package: payment.package,
					amount: `${payment.amount}${payment?.user?.country === 'ba' ? 'BAM' : 'EUR'}`,
					discounts: handleDiscounts(payment),
					status: payment.status,
					paymentMethod: payment.paymentMethod,
					createdAt: payment.createdAt,
					updatedAt: payment.updatedAt,
				})),
		[payments, showAllPayments],
	);

	const columns = useMemo(
		() => [
			{
				Header: 'Id',
				accessor: 'id',
				show: false,
			},
			{
				Header: 'User',
				accessor: 'user',
				Filter: ColumnFilter,
				disableFilters: true,
			},
			{
				Header: 'Subscription ID',
				accessor: 'subscriptionId',
				Filter: ColumnFilter,
				disableFilters: true,
			},
			{
				Header: 'Transaction ID',
				accessor: 'transactionId',
				Filter: ColumnFilter,
				disableFilters: true,
			},
			{
				Header: 'Package',
				accessor: 'package',
				Filter: ColumnFilter,
				disableFilters: true,
			},
			{
				Header: 'Amount',
				accessor: 'amount',
				Filter: ColumnFilter,
				disableFilters: true,
			},
			{
				Header: 'Discounts',
				accessor: 'discounts',
				Filter: ColumnFilter,
				disableFilters: true,
			},
			{
				Header: 'Status',
				accessor: 'status',
				Filter: ColumnFilter,
				disableFilters: true,
			},
			{
				Header: 'Payment Method',
				accessor: 'paymentMethod',
				Filter: ColumnFilter,
				disableFilters: true,
			},

			{
				Header: 'Created At',
				accessor: 'createdAt',
				Filter: ColumnFilter,
				disableFilters: true,
			},
			{
				Header: 'Updated At',
				accessor: 'updatedAt',
				Filter: ColumnFilter,
				disableFilters: true,
			},
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	const handleToggleShowAllPayments = () => {
		setShowAllPayments(!showAllPayments);
	};

	useEffect(() => {
		setDownloadSubscriptionPackages(
			payments.map((payment) => {
				return {
					id: payment?.id,
					user: `${payment?.user?.name} ${payment?.user?.surname}`,
					subscriptionId: payment.subscriptionId,
					transactionId: payment.transactionId,
					package: payment.package,
					amount: payment.amount,
					status: payment.status,
					paymentMethod: payment.paymentMethod,
				};
			}),
		);
		router.replace(router.asPath);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<div className="flex">
			<SideBar active="payments" />
			<div className="flex flex-col flex-1 w-0 overflow-hidden">
				<main className="relative flex-1 overflow-y-auto focus:outline-none">
					<div className="py-6 overflow-x-hidden">
						<div className="px-4 sm:px-6 md:px-8">
							<h1 className="text-4xl font-bold leading-normal mt-0 mb-2">Payments</h1>
						</div>
						<div className="px-4 mx-auto sm:px-6 md:px-8">
							<div className="py-4">
								<div className="px-5 py-7 rounded-lg bg-gray-50  flex flex-col gap-5">
									<div className="flex items-center justify-between">
										<CSVLink
											className="btn btn-md w-[190px] bg-secondary hover:bg-secondary/80"
											data={downloadSubscriptionPackages}
											filename={'payments-data.csv'}
										>
											Download data
										</CSVLink>
										<div className="flex items-center">
											<input
												type="checkbox"
												className="checkbox checkbox-primary"
												onChange={handleToggleShowAllPayments}
												checked={showAllPayments}
											/>
											<label htmlFor="showDeleted" className="ml-2">
												Show Deleted Users
											</label>
										</div>
									</div>

									<Table data={data} columns={columns} />
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default SubscriberPackages;

export async function getServerSideProps() {
	const payments = await prisma.payment.findMany({
		include: {
			user: true,
		},
	});

	payments.map((payment) => {
		payment.updatedAt = new Date(payment.updatedAt).toLocaleDateString('de-DE');
		payment.createdAt = new Date(payment.createdAt).toLocaleDateString('de-DE');
	});

	return {
		props: {
			payments,
		},
	};
}
