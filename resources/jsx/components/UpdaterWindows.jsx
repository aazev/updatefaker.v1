import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindows } from '@fortawesome/free-brands-svg-icons';
import 'scss/windows.scss';

export default class UpdaterWindows extends React.Component {
	static propTypes = {
		name: PropTypes.string,
		showLogo: PropTypes.bool,
	};

	static defaultProps = {
		name: 'windowsUpdater',
		showLogo: false,
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
				{showLogo && <div className="logo windows"><FontAwesomeIcon icon={faWindows} /></div>}
				<div className="loader mb-5">
					<div className="circle"></div>
					<div className="circle"></div>
					<div className="circle"></div>
					<div className="circle"></div>
					<div className="circle"></div>
					<div className="circle"></div>
				</div>
				<UpdateMessages {...{percent}}/>
			</Fragment>
		);
	}
}

class UpdateMessages extends Component{
	static propTypes = {
		lang: PropTypes.string,
		percent: PropTypes.number.isRequired,
	};

	static defaultProps ={
		lang: navigator.language??'pt-BR',
		captions:{
			'en':{
				update: "Trabalhando nas atualizações",
				turnoff: 'Não desligue o computador. Isso pode demorar um pouco.',
				reboot: 'O computador será reiniciado várias vezes'
			},
			'pt':{
				update: "Trabalhando nas atualizações",
				turnoff: 'Não desligue o computador. Isso pode demorar um pouco.',
				reboot: 'O computador será reiniciado várias vezes'
			},
			'en-US':{
				update: "Trabalhando nas atualizações",
				turnoff: 'Não desligue o computador. Isso pode demorar um pouco.',
				reboot: 'O computador será reiniciado várias vezes'
			},
			'pt-BR':{
				update: "Trabalhando nas atualizações",
				turnoff: 'Não desligue o computador. Isso pode demorar um pouco.',
				reboot: 'O computador será reiniciado várias vezes'
			}
		}
	}

	constructor(props) {
		super(props);
	}

	getLang(){
		let { lang, captions } = this.props;

		if(lang in captions)
			return captions[lang];
		else if(lang.replace(/[_-]\w{2}$/,'') in captions)
			return captions[lang.replace(/[_-]\w{2}$/,'') in captions];
		else
			return captions.pt;
	}

	render() {
		let { lang, percent } = this.props,
			captions = this.getLang();

		return (
			<Fragment>
				<div className="message percent">{captions.update} {percent}%</div>
				<div className="message power">{captions.turnoff}</div>
				<div className="message reboot mt-10">{captions.reboot}</div>
			</Fragment>
		)
	}
}