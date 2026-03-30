export const JotaCaptcha = {
	generateCaptcha(length: number = 5): string {
		const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
		let result = "";
		for (let i = 0; i < length; i++) {
			result += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return result;
	},

	validate(input: string, captcha: string): boolean {
		return input.trim().toUpperCase() === captcha.toUpperCase();
	},
};
