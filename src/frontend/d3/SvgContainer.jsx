import React from 'react/addons'

export default class SvgContainer extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			width: 100
		}
	}

	componentDidMount() {
		var width = this.refs.svg.getDOMNode().offsetWidth;
		this.setState({
			width: width
		});
	}

	renderChildren() {
		return React.Children.map(this.props.children, function (child) {
			return React.addons.cloneWithProps(child, {
	  			width: this.state.width
			})
		}.bind(this))
	}

	render(){
		return (
			<svg id={this.props._id} ref='svg' width={this.props.width} height={this.props.height}>
				{this.renderChildren()}
			</svg>
		)
	}
}