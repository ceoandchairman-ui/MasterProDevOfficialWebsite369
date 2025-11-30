import Home from './pages/Home';
import HireConsultant from './pages/HireConsultant';
import ConsultantDetail from './pages/ConsultantDetail';
import SearchResults from './pages/SearchResults';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import TellYourIdeaPage from './pages/TellYourIdeaPage';
import Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "HireConsultant": HireConsultant,
    "ConsultantDetail": ConsultantDetail,
    "SearchResults": SearchResults,
    "AboutPage": AboutPage,
    "ServicesPage": ServicesPage,
    "ContactPage": ContactPage,
    "TellYourIdeaPage": TellYourIdeaPage,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: Layout,
};