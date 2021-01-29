import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';
import platform from 'platform-detect';
import { snakeToCamel } from 'common/functions';

import YouTube from 'react-youtube';
import UpdaterWindows from 'components/UpdaterWindows.jsx';
import UpdaterMacOS from 'components/UpdaterMacOS.jsx';

class Updater extends Component{
	static propTypes = {
		maxClicks: PropTypes.number
	};

	static defaultProps = {
		maxClicks: 1000,
	};
	constructor(props) {
		super(props);

		this._ref = React.createRef();

		this.state={
			clicks: 0,
		}
	}

	componentDidMount() {
		this._ref.current.closest('.wrapper').classList.add(this.getOs());
	}

	componentDidUpdate(prevProps, prevState) {
		this._ref.current.closest('.wrapper').classList.add(this.getOs());
	}

	getOs(){
		let { forcePlatform } = this.props
		if(['windows', 'macos', 'linux'].includes(forcePlatform))
			return forcePlatform;
		if(platform.windows)
			return 'windows';
		if(platform.macos)
			return 'macos';
		if(platform.linux)
			return 'macos';
	}

	handleClick(){
		if(!document.fullscreenElement){
			this._ref.current.requestFullscreen();
		} else {
			this.setState(prevState=>{
				let { clicks } = prevState;
				clicks++;
				return {
					clicks
				}
			})
		}
	}

	render(){
		let { clicks } = this.state,
			{ maxClicks } = this.props,
			os = this.getOs(),
			video = clicks>maxClicks;

		return (
			<Fragment>
				{!video && <div ref={this._ref} className="upgradeContainer" onClick={this.handleClick.bind(this)}>
					{os=='windows' && <UpdaterWindows />}
					{os=='macos' && <UpdaterMacOS />}
				</div>}
				{video && <div className="videoContainer">
					<YouTube videoId="dQw4w9WgXcQ" opts={{
						width: 640,
						height:480,
						playerVars:{
							autoplay: 1,
							controls: 0,
							fs:0,
						}
					}} />
				</div>}
			</Fragment>
		)
	}
}

let mountPoint = document.querySelector("#updater"),
	props={};

if(mountPoint){
	Array.from(mountPoint.attributes).filter(att=>att.name.match(/^data-/) || ['class'].includes(att.name)).forEach(att=>{
		let name = snakeToCamel(att.name.replace(/^data-/i,'')),
			data, isJson=true;
		try{
			data = JSON.parse(mountPoint.getAttribute(att.name));
		} catch(e) {
			isJson=false;
		} finally {
			props[name] = isJson?data:mountPoint.getAttribute(att.name).trim();
			if(/^data-/i.test(att.name))
				mountPoint.removeAttribute(att.name);
		}
	});

	render(<Updater {...props} />, mountPoint);
} else {
}
