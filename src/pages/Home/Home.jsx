import Banner from "./Banner";
import LatestIssues from "./LatestIssues";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import CallToAction from "./CallToAction";
import Testimonials from "./Testimonials";

const Home = () => {
    return (
        <div className="space-y-20 pb-20">
            <Banner />
            <LatestIssues />
            <Features />
            <HowItWorks />
            <CallToAction />
            <Testimonials />
        </div>
    );
};

export default Home;
