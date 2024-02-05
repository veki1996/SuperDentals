// Const for billing
export const PROMO_VALUE = 5;
export const PDV_VALUE = 17.0;

// Consts for images
export const startImages = 4;
export const standardImages = 8;
export const premiumImages = 12;
export const premiumPlusImages = 12;

// Consts for services
export const startServices = 6;
export const standardServices = 10;
export const premiumServices = (clinic) => {
	return clinic?.clinicServices?.length;
};
export const premiumPlusServices = (clinic) => {
	return clinic?.clinicServices?.length;
};

// Consts for airports distances
export const standardDistances = 3;
export const premiumDistances = 6;
export const premiumPlusDistances = 6;
