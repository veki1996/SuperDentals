import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const configuration = {
	providers: [
		CredentialsProvider({
			id: 'credentials',
			name: 'credentials',
			credentials: {},
			async authorize(credentials) {
				const link =
					process.env.NODE_ENV === 'production' ? `${process.env.PRODUCTION_BASE_URL}` : `${process.env.BASE_URL}`;
				const res = await fetch(`${link}/api/auth/login`, {
					method: 'POST',
					body: JSON.stringify(credentials),
					headers: { 'Content-Type': 'application/json' },
				});

				const user = await res.json();

				if (res.ok && user) {
					return user;
				}

				return null;
			},
		}),
	],
	session: {
		strategy: 'jwt',
		options: {
			sameSite: 'None',
			secure: true,
		},
	},
	callbacks: {
		async signIn({ user }) {
			return user;
		},
		async redirect({ baseUrl }) {
			return baseUrl;
		},

		async session({ token, session }) {
			if (token) {
				session.id = token.id;
				session.role = token.role;
				session.name = token.name;
				session.surname = token.surname;
				session.phoneNumber = token.phoneNumber;
				session.email = token.email;
				session.verified = token.verified;
				session.referalCode = token.referalCode;
				session.active = token.active;
				session.subscriber = token.subscriber;
				session.hash = token.hash;
				session.clinicId = token.clinicId;
				session.subscriptionPackage = token.subscriptionPackage;
			}
			return session;
		},

		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
				token.name = user.name;
				token.surname = user.surname;
				token.phoneNumber = user.phoneNumber;
				token.email = user.email;
				token.verified = user.verified;
				token.referalCode = user.referalCode;
				token.active = user.active;
				token.subscriber = user.subscriber;
				token.hash = user.hash;
				token.clinicId = user.clinicId;
				token.subscriptionPackage = user.subscriptionPackage;
			}
			return token;
		},
	},

	pages: {
		signIn: '/',
	},
};

const authConfigNext = (req, res) => NextAuth(req, res, configuration);
export default authConfigNext;
