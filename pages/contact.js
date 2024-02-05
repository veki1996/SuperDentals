import { Contact, HeadMeta, Footer, Nav } from '/components';
import { GrMail } from 'react-icons/gr';
import { HiPhone } from 'react-icons/hi';
import { FaFacebookF, FaInstagram, FaTiktok, FaLinkedinIn, FaTwitter, FaYoutube } from 'react-icons/fa';
import Image from 'next/image';
import { useAtom } from 'jotai';
import { socialLinksAtom } from '/store';
import { prisma } from '/utils/db';
import useTranslation from 'next-translate/useTranslation';

const ContactForm = ({ contactSettings }) => {
	const [socialSettings] = useAtom(socialLinksAtom);
	const { t } = useTranslation('contact');

	const facebook = socialSettings?.find((setting) => setting?.name === 'Social Facebook');
	const instagram = socialSettings?.find((setting) => setting?.name === 'Social Instagram');
	const tiktok = socialSettings?.find((setting) => setting?.name === 'Social Tiktok');
	const linkedin = socialSettings?.find((setting) => setting?.name === 'Social Linkedin');
	const youtube = socialSettings?.find((setting) => setting?.name === 'Social Youtube');
	const twitter = socialSettings?.find((setting) => setting?.name === 'Social Twitter');

	const phoneSerbia = contactSettings?.find((setting) => setting?.name === 'Contact Phone Serbia');
	const phoneBosnia = contactSettings?.find((setting) => setting?.name === 'Contact Phone Bosnia');
	const phoneMontenegro = contactSettings?.find((setting) => setting?.name === 'Contact Phone Montenegro');
	const contactEmail = contactSettings?.find((setting) => setting?.name === 'Contact Email');
	const contactMessenger = contactSettings?.find((setting) => setting?.name === 'Contact Messenger');

	//clean phone numbers allow only numbers
	const cleanPhone = (number) => {
		const clean = number?.replace(/[^0-9]/g, '');
		return clean;
	};

	return (
		<div>
			<Nav />
			<section className="min-h-[calc(100vh-(189px*2))]">
				<div className="lg:bg-new-contact-image md:bg-no-repeat lg:bg-auto md:bg-[right_-3rem_top_-1rem] pb-12 lg:py-12">
					<HeadMeta
						title="Kontakt"
						link={`${process.env.BASE_URL}/contact`}
						content={'superdentals.com'}
						description="Tražite stomatologa po svojoj mjeri? Na pravom ste mjestu."
						image={`${process.env.BASE_URL}/images/logo.jpg`}
					/>
					<section className="container mx-auto px-6 md:px-16 flex flex-col gap-8 lg:gap-20 lg:flex-row pb-12 lg:py-12">
						<div className=" lg:basis-[45%] flex flex-col gap-10">
							<h1 className="text-primaryColor xl:text-heading text-[42px] font-bold text-center lg:text-left pt-5 lg:pt-0">
								Kontakt
							</h1>

							<Contact />
						</div>
						<div className="flex flex-col lg:basis-[55%] lg:self-end  py-1  justify-center gap-4">
							{contactEmail && contactEmail?.defaultValue && (
								<div className=" flex justify-start gap-4 py-0 ">
									<GrMail className="  text-white bg-primaryColor rounded-[15px] p-1" size={32} />
									<h1 className=" text-primaryColor font-bold md:text-[25px]">
										<a href={`mailto:${contactEmail?.defaultValue}`}>{contactEmail?.defaultValue}</a>
									</h1>
								</div>
							)}

							<div className="flex flex-col xl:flex-row justify-between gap-2">
								{phoneSerbia && phoneSerbia?.defaultValue && (
									<div className="flex items-center gap-4">
										<HiPhone className="text-white bg-primaryColor p-[4px] rounded-[15px]" size={32} />
										<h1 className="font-semibold md:text-[20px]">
											({t('contact.text-8')}): {phoneSerbia?.defaultValue}
										</h1>
									</div>
								)}

								<div className="flex xl:justify-between gap-4">
									<a href={contactMessenger?.defaultValue} target="_blank" className="flex flex-col" rel="noreferrer">
										<div className="mButton flex justify-center">
											<Image alt="messenger" src="/contact-page-assets/messenger.svg" width={54} height={54} />
										</div>
									</a>

									<a
										href={`viber://chat?number=%2B${cleanPhone(phoneSerbia?.defaultValue)}`}
										className="flex flex-col"
										target="_blank"
										rel="noreferrer"
									>
										<div className="vButton flex justify-center">
											<Image alt="viber" src="/contact-page-assets/viber.svg" width={54} height={54} />
										</div>
									</a>
									<a
										href={`https://wa.me/${cleanPhone(phoneSerbia?.defaultValue)}`}
										target="_blank"
										className="flex flex-col"
										rel="noreferrer"
									>
										<div className="wButton flex justify-center">
											<Image alt="whatsapp" src="/contact-page-assets/whatsapp.svg" width={54} height={54} />
										</div>
									</a>
								</div>
							</div>

							<div className="flex flex-col xl:flex-row justify-between gap-2">
								{phoneBosnia && phoneBosnia?.defaultValue && (
									<div className="flex items-center gap-4">
										<HiPhone className="  text-white bg-primaryColor p-[4px] rounded-[15px]" size={32} />
										<h1 className="  font-semibold md:text-[20px]">
											({t('contact.text-9')}): {phoneBosnia?.defaultValue}
										</h1>
									</div>
								)}

								<div className="flex xl:justify-between gap-4">
									<a href={contactMessenger?.defaultValue} target="_blank" className="flex flex-col" rel="noreferrer">
										<div className="mButton flex justify-center">
											<Image alt="messenger" src="/contact-page-assets/messenger.svg" width={54} height={54} />
										</div>
									</a>

									<a
										href={`viber://chat?number=%2B${cleanPhone(phoneBosnia?.defaultValue)}`}
										className="flex flex-col"
										target="_blank"
										rel="noreferrer"
									>
										<div className="vButton flex justify-center">
											<Image alt="viber" src="/contact-page-assets/viber.svg" width={54} height={54} />
										</div>
									</a>
									<a
										href={`https://wa.me/${cleanPhone(phoneBosnia?.defaultValue)}`}
										target="_blank"
										className="flex flex-col"
										rel="noreferrer"
									>
										<div className="wButton flex justify-center">
											<Image alt="whatsapp" src="/contact-page-assets/whatsapp.svg" width={54} height={54} />
										</div>
									</a>
								</div>
							</div>
							<div className="flex flex-col xl:flex-row justify-between gap-2">
								{phoneMontenegro && phoneMontenegro?.defaultValue && (
									<div className="flex items-center gap-4">
										<HiPhone className=" text-white bg-primaryColor p-[4px] rounded-[15px]" size={32} />
										<h1 className="  font-semibold md:text-[20px]">
											({t('contact.text-10')}): {phoneMontenegro?.defaultValue}
										</h1>
									</div>
								)}

								<div className="flex xl:justify-between gap-4">
									<a href={contactMessenger?.defaultValue} target="_blank" className="flex flex-col" rel="noreferrer">
										<div className="mButton flex justify-center">
											<Image alt="messenger" src="/contact-page-assets/messenger.svg" width={54} height={54} />
										</div>
									</a>

									<a
										href={`viber://chat?number=%2B${cleanPhone(phoneMontenegro?.defaultValue)}`}
										className="flex flex-col"
										target="_blank"
										rel="noreferrer"
									>
										<div className="vButton flex justify-center">
											<Image alt="viber" src="/contact-page-assets/viber.svg" width={54} height={54} />
										</div>
									</a>
									<a
										href={`https://wa.me/${cleanPhone(phoneMontenegro?.defaultValue)}`}
										target="_blank"
										className="flex flex-col"
										rel="noreferrer"
									>
										<div className="wButton flex justify-center">
											<Image alt="whatsapp" src="/contact-page-assets/whatsapp.svg" width={54} height={54} />
										</div>
									</a>
								</div>
							</div>
							{socialSettings?.length > 0 && (
								<div className=" justify-center flex lg:justify-start gap-6 sm:gap-10 md:items-center pt-5 md:pt-2 ">
									{facebook && facebook?.defaultValue && (
										<a href={facebook?.defaultValue} target="_blank" rel="noreferrer">
											<FaFacebookF
												color="#FC5122"
												className=" rounded-[5px] p-1 cursor-pointer hover:scale-110 hover:bg-white/80 transition"
												size={40}
											/>
										</a>
									)}

									{instagram && instagram?.defaultValue && (
										<a href={instagram?.defaultValue} target="_blank" rel="noreferrer">
											<FaInstagram
												color="#FC5122"
												className=" rounded-[5px] p-1 cursor-pointer hover:scale-110 hover:bg-white/80 transition"
												size={40}
											/>
										</a>
									)}

									{twitter && twitter?.defaultValue && (
										<a href={twitter?.defaultValue} target="_blank" rel="noreferrer">
											<FaTwitter
												color="#FC5122"
												className=" rounded-[5px] p-1 cursor-pointer hover:scale-110 hover:bg-white/80 transition"
												size={40}
											/>
										</a>
									)}

									{linkedin && linkedin?.defaultValue && (
										<a href={linkedin?.defaultValue} target="_blank" rel="noreferrer">
											<FaLinkedinIn
												color="#FC5122"
												className=" rounded-[5px] p-1 cursor-pointer hover:scale-110 hover:bg-white/80 transition"
												size={40}
											/>
										</a>
									)}

									{youtube && youtube?.defaultValue && (
										<a href={youtube?.defaultValue} target="_blank" rel="noreferrer">
											<FaYoutube
												color="#FC5122"
												className=" rounded-[5px] p-1 cursor-pointer hover:scale-110 hover:bg-white/80 transition"
												size={40}
											/>
										</a>
									)}

									{tiktok && tiktok?.defaultValue && (
										<a href={tiktok?.defaultValue} target="_blank" rel="noreferrer">
											<FaTiktok
												color="#FC5122"
												className=" rounded-[5px] p-1 cursor-pointer hover:scale-110 hover:bg-white/80 transition"
												size={40}
											/>
										</a>
									)}
								</div>
							)}
						</div>
					</section>
				</div>
			</section>

			<Footer />
		</div>
	);
};

export default ContactForm;

export async function getServerSideProps() {
	const contactSettings = await prisma.setting.findMany({
		where: {
			name: {
				startsWith: 'Contact',
			},
		},
	});

	return {
		props: {
			contactSettings,
		},
	};
}
