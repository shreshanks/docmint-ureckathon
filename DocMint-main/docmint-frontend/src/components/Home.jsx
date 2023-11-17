import { Link } from "react-router-dom";
import "../styles/Home.scss";
const Home = () => {
	return (
		<div className="home">
			<h1 style={{ fontWeight: 600 }}>
				Create And Verify NFT Certificates & Documents
			</h1>
			
			<div className="info">
				<div className="links">
					<Link role="button" to="/create">
						Issue
					</Link>
					<Link role="button" to="/verify">
						Verify
					</Link>
					<Link role="button" to="/actions">
						Manage
					</Link>
				</div>
				<img src="/art-1.png" alt="docmint logo" />
			</div>
			<p>Built on the Polygon blockchain, For Security And Trust</p>
		</div>
	);
};

export default Home;
