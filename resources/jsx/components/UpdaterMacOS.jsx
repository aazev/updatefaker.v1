import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faApple } from '@fortawesome/free-brands-svg-icons';
import 'scss/macos.scss';

export default class UpdaterMacOS extends Component {
	static propTypes = {
		name: PropTypes.string,
		showLogo: PropTypes.bool,
	};

	static defaultProps = {
		name: 'macOsUpdater',
		showLogo: true,
	};

	constructor(props) {
		super(props);

		this.state = {
			percent: 0,
		}
	}

	componentDidMount() {
		let { percent } = this.state;
		this._timer = setTimeout(this.stepPercentage.bind(this), 1000000 / (100-percent));
	}

	componentWillUnmount() {
		clearTimeout(this._timer);
	}

	stepPercentage(){
		this.setState(prevState=>{
			let { percent } = prevState;
			this._timer = setTimeout(this.stepPercentage.bind(this), 1000000 / (100-percent));

			return {
				percent: percent+1>100?0:percent+1,
			}
		})
	}

	render() {
		let { name, showLogo } = this.props;
		let { percent } = this.state;
		return (
			<Fragment>
				{showLogo && <div className="logo apple my-5"><FontAwesomeIcon icon={faApple} /></div>}
				<ProgressBar {...{percent}} />
			</Fragment>
		);
	}
}

class ProgressBar extends Component {
	static propTypes = {
		percent: PropTypes.number.isRequired,
	};

	constructor(props) {
		super(props);

		this._ref = React.createRef();
	}

	componentDidMount() {
		this.setCSSPercent();
	}

	componentDidUpdate() {
		this.setCSSPercent();
	}

	setCSSPercent(){
		let { percent } = this.props;
		this._ref.current.style.setProperty('--percent', percent)
	}

	render(){
		let { percent } = this.props;
		return (
			<div ref={this._ref} className="progressbar" />
		);
	}
}