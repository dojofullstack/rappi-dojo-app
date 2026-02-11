import Header from "../components/Header";
import Search from "../components/Search";
import Restaurantes from "../components/Restaurantes";
import Footer from "../components/Footer";
import App from "../components/App";
import Carousel from "../components/Carousel";


const RestaurantesView = () => {
    return (
        <div>

            <Header/>
            {/* <Search/> */}
            {/* <Restaurantes/> */}

            <Carousel banner={"https://stakeholders.com.pe/wp-content/uploads/2024/06/6659b7ff28fa0-838x390-1-jpg.webp"} />
            <App/>
            <Footer/>

        </div>
    );
}

export default RestaurantesView;