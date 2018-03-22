import '../styles/admin.scss';

export default (Component) => {
	return class AdminLayout extends React.Component {
		static async getInitialProps(props) {
			return Component.getInitialProps ?
				Component.getInitialProps(props) :
				{}
		}

		render() {
			return <Component {...this.props}/>
		}
	}
}
