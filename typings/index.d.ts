declare module "*.json" {
	const value: {
		[key:string]: any
	};
	export default value;
}

declare module "*.scss" {
	const styles: any;
	export default styles;
}
