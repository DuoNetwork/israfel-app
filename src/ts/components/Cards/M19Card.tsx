import { Button, Card } from 'antd';
import * as React from 'react';
import temp from '../../../images/temp.png';

export default class M19Card extends React.Component<any> {
	public render() {
		return (
			<Card title="Title" style={{ width: 600, margin: '5px' }}>
				<div className="Row" style={{ display: 'flex' }}>
					<div style={{ width: '410px' }}>
						<div className="Row" style={{ display: 'flex', height: '60px' }}>
							<div style={{ width: '50%', border: '2px dashed #bfbfbf63' }}>
								<p>123</p>
								<p
									className="right"
									style={{ marginLeft: '80%', marginBottom: '0' }}
								>
									456
								</p>
							</div>
							<div style={{ width: '50%', border: '2px dashed #bfbfbf63' }}>
								<p>123</p>
								<p
									className="right"
									style={{ marginLeft: '80%', marginBottom: '0' }}
								>
									456
								</p>
							</div>
						</div>
						<div style={{ marginTop: '5px' }}>
							<img
								src={temp}
								style={{ width: '100%', border: '2px dashed #bfbfbf63' }}
							/>
						</div>
						<div style={{ marginTop: '5px' }}>
							<img
								src={temp}
								style={{ width: '100%', border: '2px dashed #bfbfbf63' }}
							/>
						</div>
					</div>
					<div className="RightPart" style={{ width: '180px', marginLeft: '10px' }}>
						<div style={{ height: '60px' }}>
							<Button style={{ width: '100%' }}>Conversion</Button>
						</div>
						<div style={{ width: '100%', marginTop: '5px' }}>
							<p
								style={{
									border: '2px dashed #bfbfbf63',
									marginBottom: '0'
								}}
							>
								123
							</p>
							<p
								className="right"
								style={{
									border: '2px dashed #bfbfbf63',
									paddingLeft: '80%',
									marginBottom: '10px'
								}}
							>
								456
							</p>
						</div>

						<Button style={{ width: '100%', marginTop: '20px' }}>Trade aETH</Button>
						<div style={{ width: '100%', marginTop: '10px' }}>
							<p
								style={{
									border: '2px dashed #bfbfbf63',
									marginBottom: '0'
								}}
							>
								123
							</p>
							<p
								className="right"
								style={{
									border: '2px dashed #bfbfbf63',
									paddingLeft: '80%',
									marginBottom: '10px'
								}}
							>
								456
							</p>
						</div>
						<Button style={{ width: '100%', marginTop: '20px' }}>Trade bETH</Button>
					</div>
				</div>
			</Card>
		);
	}
}
