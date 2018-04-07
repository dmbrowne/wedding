import * as React from 'react';

interface GetInitialPropsDefinition {
	req?: {
		locals: { [key: string]: any },
		session?: { [key: string]: any },
	};
	res?: { [key: string]: any };
	pathname?: string;
	query?: string;
	asPath?: string;
	jsonPageRes?: Response;
	err?: { [key: string]: any };
	[key: string]: any;
}

export interface NextComponent<T = {}> extends React.ComponentClass<T> {
	getInitialProps?: (props: GetInitialPropsDefinition) => Promise<{ [key: string]: any }>;
}
