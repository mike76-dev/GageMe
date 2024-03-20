import './HostDetails.css'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import {
    Host,
    getHost,
    stripePrefix,
    useLocations
} from '../../api'
import { HostInfo, Loader, NodeSelector } from '../'

type HostDetailsProps = {
	darkMode: boolean,
	hosts: Host[]
}

export const HostDetails = (props: HostDetailsProps) => {
    const locations = useLocations()
	const { publicKey } = useParams()
	const [host, setHost] = useState<Host>()
	const { hosts } = props
	const network = (window.location.pathname.toLowerCase().indexOf('zen') >= 0 ? 'zen' : 'mainnet')
	const [loading, setLoading] = useState(false)
    const nodes = ['global'].concat(locations)
    const [node, setNode] = useState(nodes[0])
	useEffect(() => {
		let h = hosts.find(h => stripePrefix(h.publicKey) === publicKey)
		if (h) setHost(h)
		else {
			setLoading(true)
			getHost(network, publicKey || '')
			.then(data => {
				if (data && data.status === 'ok' && data.host) {
					setHost(data.host)
				}
				setLoading(false)
			})
		}
	}, [network, hosts, publicKey])
	return (
		<div className={'host-details-container' + (props.darkMode ? ' host-details-dark' : '')}>
			{loading ?
				<Loader darkMode={props.darkMode}/>
			: (host ?
                <div className="host-details-subcontainer">
                    <NodeSelector
                        darkMode={props.darkMode}
                        nodes={nodes}
                        node={node}
                        setNode={setNode}
                    />
    				<HostInfo
	    				darkMode={props.darkMode}
		    			host={host}
                        node={node}
				    />
                </div>
			:
				<div className="host-not-found">Host Not Found</div>
			)}
		</div>
	)
}
