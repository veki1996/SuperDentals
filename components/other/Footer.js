import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { FaFacebookF, FaInstagram, FaTiktok, FaLinkedinIn, FaTwitter, FaYoutube } from 'react-icons/fa';
import { useAtom } from 'jotai';
import { socialLinksAtom } from '/store';
import useTranslation from 'next-translate/useTranslation';

const Footer = () => {
	const { t } = useTranslation('footer');

	const router = useRouter();
	const { data: session } = useSession();

	const [socialSettings] = useAtom(socialLinksAtom);

	const facebook = socialSettings?.find((setting) => setting?.name === 'Social Facebook');
	const instagram = socialSettings?.find((setting) => setting?.name === 'Social Instagram');
	const tiktok = socialSettings?.find((setting) => setting?.name === 'Social Tiktok');
	const linkedin = socialSettings?.find((setting) => setting?.name === 'Social Linkedin');
	const youtube = socialSettings?.find((setting) => setting?.name === 'Social Youtube');
	const twitter = socialSettings?.find((setting) => setting?.name === 'Social Twitter');

	return (
		<div className="bg-[#0D3082]">
			<section className="container mx-auto px-6 lg:pl-16 py-6 lg:py-8 grid grid-cols-1 lg:grid-cols-4 gap-5 text-center lg:text-left">
				<div className="lg:self-center">
					<Link href="/">
						<div className="cursor-pointer">
							<Image alt="Logo image" src="/home-page-assets/footer-logo.svg" width={270} height={85} />
						</div>
					</Link>
					<div className="text-white text-[14px] flex flex-col">
						<span>Copyright &copy; 2022-{new Date().getFullYear()}</span>
						<span>PUBLIKA Consulting</span>
						<span>{t('footer.text-2')}</span>
					</div>
				</div>
				<div className="text-[#D9D9D9] flex flex-col lg:ml-20 lg:gap-2 lg:justify-between">
					<Link href="/">
						<span className="cursor-pointer hover:text-white transition uppercase">{t('footer-menu.item-1')}</span>
					</Link>
					<Link href="/about">
						<span className="cursor-pointer hover:text-white transition uppercase">{t('footer-menu.item-2')}</span>
					</Link>
					<a href="https://blog.superdentals.com/">
						<span className="cursor-pointer hover:text-white transition uppercase">{t('footer-menu.item-3')}</span>
					</a>
					<Link href="/learn-more">
						<span className="cursor-pointer hover:text-white transition uppercase">{t('footer-menu.item-4')}</span>
					</Link>
					<Link href="/contact">
						<span className="cursor-pointer hover:text-white transition uppercase">{t('footer-menu.item-5')}</span>
					</Link>
				</div>
				<div className="text-[#D9D9D9] flex flex-col lg:gap-2 lg:justify-between">
					<Link href="/dental-tourism">
						<span className="cursor-pointer hover:text-white transition uppercase">{t('footer-menu.item-6')}</span>
					</Link>
					<Link href="/partners">
						<span className="cursor-pointer hover:text-white transition uppercase">{t('footer-menu.item-7')}</span>
					</Link>
					<Link href="/marketing">
						<span className="cursor-pointer hover:text-white transition uppercase">{t('footer-menu.item-8')}</span>
					</Link>
					<Link href="/privacy-policy">
						<span className="cursor-pointer hover:text-white transition uppercase">{t('footer-menu.item-9')}</span>
					</Link>
					<Link href="/tos">
						<span className="cursor-pointer hover:text-white transition uppercase">{t('footer-menu.item-10')}</span>
					</Link>
				</div>
				<div className="flex justify-center items-center flex-col gap-2">
					<div>
						<button
							onClick={session ? () => router.push('/create-clinic') : () => router.push('/register')}
							className="button bg-white text-[#0C4076] lg:px-14 lg:py-2 hover:bg-white/80 transition-colors"
						>
							{t('footer.text-1')}
						</button>
					</div>
					<div className="flex justify-between items-center gap-3 my-4 bg-white p-2 rounded-lg">
						<a href="https://www.mastercard.com" target="_blank" rel="noreferrer" className="flex items-center">
							<Image src="/images/mastercard.png" alt="Mastercard" width={70} height={50} />
						</a>
						<a
							href="https://brand.mastercard.com/brandcenter/more-about-our-brands.html"
							target="_blank"
							rel="noreferrer"
							className="flex items-center"
						>
							<Image src="/images/maestro.png" alt="Maestro" width={70} height={50} />
						</a>
						<a href="https://www.visaeurope.com" target="_blank" rel="noreferrer" className="flex items-center">
							<Image src="/images/visa.gif" alt="Visa" width={70} height={50} />
						</a>
						<Image src="/images/mc-id.png" alt="Visa" width={70} height={50} />
						<Image src="/images/visa-secure.jpg" alt="Visa" width={70} height={50} />
					</div>
					{socialSettings?.length > 0 && (
						<div className="flex items-center justify-center gap-3">
							{facebook && facebook?.defaultValue && (
								<a href={facebook?.defaultValue} target="_blank" rel="noreferrer">
									<FaFacebookF
										color="#0C4076"
										className="bg-white rounded-[5px] p-1 cursor-pointer hover:scale-110 hover:bg-white/80 transition"
										size={30}
									/>
								</a>
							)}

							{instagram && instagram?.defaultValue && (
								<a href={instagram?.defaultValue} target="_blank" rel="noreferrer">
									<FaInstagram
										color="#0C4076"
										className="bg-white rounded-[5px] p-1 cursor-pointer hover:scale-110 hover:bg-white/80 transition"
										size={30}
									/>
								</a>
							)}

							{twitter && twitter?.defaultValue && (
								<a href={twitter?.defaultValue} target="_blank" rel="noreferrer">
									<FaTwitter
										color="#0C4076"
										className="bg-white rounded-[5px] p-1 cursor-pointer hover:scale-110 hover:bg-white/80 transition"
										size={30}
									/>
								</a>
							)}

							{linkedin && linkedin?.defaultValue && (
								<a href={linkedin?.defaultValue} target="_blank" rel="noreferrer">
									<FaLinkedinIn
										color="#0C4076"
										className="bg-white rounded-[5px] p-1 cursor-pointer hover:scale-110 hover:bg-white/80 transition"
										size={30}
									/>
								</a>
							)}

							{youtube && youtube?.defaultValue && (
								<a href={youtube?.defaultValue} target="_blank" rel="noreferrer">
									<FaYoutube
										color="#0C4076"
										className="bg-white rounded-[5px] p-1 cursor-pointer hover:scale-110 hover:bg-white/80 transition"
										size={30}
									/>
								</a>
							)}

							{tiktok && tiktok?.defaultValue && (
								<a href={tiktok?.defaultValue} target="_blank" rel="noreferrer">
									<FaTiktok
										color="#0C4076"
										className="bg-white rounded-[5px] p-1 cursor-pointer hover:scale-110 hover:bg-white/80 transition"
										size={30}
									/>
								</a>
							)}
						</div>
					)}
				</div>
			</section>
		</div>
	);
};

export default Footer;
