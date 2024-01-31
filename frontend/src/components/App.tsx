// ----------------------------------
// App.tsx - Hauptkomponente der Anwendung
// ----------------------------------

// Import von Modulen und Komponenten
import '../stylesheets/App.css';
import Header from './Header.tsx';
import List from './List.tsx';
import {useEffect, useState} from 'react';
import RadioStation from '../models/RadioStation.ts';
import AudioPlayer from "./AudioPlayer.tsx";
import AppUser from "../models/AppUser.ts";
import { functions } from "../assets/functions.ts"
import {Route, Routes} from "react-router-dom";
import Login from "./Login.tsx";
import Footer from "./Footer.tsx";

// Hauptfunktion für die App-Komponente
function App() {
    // Zustände für die App-Komponente
    const [playerVisibilityClass, setPlayerVisibilityClass] = useState<string>("playerNotVisible");
    const [isPlaying, setIsPlaying] = useState(false);
    const [actualStation, setActualStation] = useState<RadioStation>();
    const [mainPlayLoadingSpinnerVisible, setMainPlayLoadingSpinnerVisible] = useState<boolean>(false);
    const [appUser, setAppUser] = useState<AppUser | undefined | null>(undefined)
    const [mainList, setMainList] = useState<RadioStation[]>([]);
    const [favList, setFavList] = useState<RadioStation[]>([]);
    const [marginListBottom, setMarginListBottom] = useState<string>("");
    const [searchMainListDone, setSearchMainListDone] = useState<boolean>(false);
    const [searchFavListDone, setSearchFavListDone] = useState<boolean>(false);
    const [mainListAmountNumber, setMainListAmountNumber] = useState<number>(20);
    const [favListAmountNumber, setFavListAmountNumber] = useState<number>(20);
    const [searchMainInput, setSearchMainInput] = useState<string>("");
    const [searchFavInput, setSearchFavInput] = useState<string>("");
    const [selectedCountry, setSelectedCountry] = useState<string>("")
    const [selectedGenre, setSelectedGenre] = useState<string>("")
    const [selectedSort, setSelectedSort] = useState<string>("votes")

    useEffect(() => {
        functions.getMe(setAppUser);
        functions.fetchData(    // Abfrage für Main list
            "",
            20,
            setMainList,
            setSearchMainListDone,
            selectedCountry,
            selectedGenre,
            selectedSort
        )
    }, [])

    useEffect(() => {
        setFavList(appUser ? appUser.favoriteRadioStations : [])
        setSearchFavListDone(true)
    }, [appUser]);

    // Rendern der App-Komponente
    return (
        <>
            {/* Header-Komponente für den oberen Teil der Anwendung */}
            <Header/>
            <Routes>

                {/* MAIN → List-Komponente für die Anzeige der Radiostationen */}
                <Route
                    path="/"
                    element={
                        <List
                            listTopic={""}
                            setActualStation={setActualStation}
                            setIsPlaying={setIsPlaying}
                            actualStation={actualStation}
                            list={mainList}
                            setList={setMainList}
                            marginListBottom={marginListBottom}
                            setMarginListBottom={setMarginListBottom}
                            searchDone={searchMainListDone}
                            setSearchDone={setSearchMainListDone}
                            listAmountNumber={mainListAmountNumber}
                            setListAmountNumber={setMainListAmountNumber}
                            searchInput={searchMainInput}
                            setSearchInput={setSearchMainInput}
                            appUser={appUser}
                            setAppUser={setAppUser}
                            fromFavList={false}
                            setSelectedCountry={setSelectedCountry}
                            selectedCountry={selectedCountry}
                            selectedGenre={selectedGenre}
                            setSelectedGenre={setSelectedGenre}
                            selectedSort={selectedSort}
                            setSelectedSort={setSelectedSort}
                        />}
                />

                {/* FAVORITES → List-Komponente für die Anzeige der Radiostationen */}
                <Route
                    path="/favorites"
                    element={
                        <List
                            listTopic={"favorites"}
                            setActualStation={setActualStation}
                            setIsPlaying={setIsPlaying}
                            actualStation={actualStation}
                            list={favList}
                            setList={setFavList}
                            marginListBottom={marginListBottom}
                            setMarginListBottom={setMarginListBottom}
                            searchDone={searchFavListDone}
                            setSearchDone={setSearchFavListDone}
                            listAmountNumber={favListAmountNumber}
                            setListAmountNumber={setFavListAmountNumber}
                            searchInput={searchFavInput}
                            setSearchInput={setSearchFavInput}
                            appUser={appUser}
                            setAppUser={setAppUser}
                            fromFavList={true}
                            setSelectedCountry={setSelectedCountry}
                            selectedCountry={selectedCountry}
                            selectedGenre={selectedGenre}
                            setSelectedGenre={setSelectedGenre}
                            selectedSort={selectedSort}
                            setSelectedSort={setSelectedSort}
                        />}
                />
                {/* LOGIN → Statt List-Komponente, falls nicht eingeloggt */}
                <Route path="/login" element={<Login appUser={appUser}/>}></Route>
            </Routes>

            {/* AudioPlayer-Komponente für die Steuerung des Radioplayers */}
            <AudioPlayer
                actualStation={actualStation}
                mainPlayLoadingSpinnerVisible={mainPlayLoadingSpinnerVisible}
                setMainPlayLoadingSpinnerVisible={setMainPlayLoadingSpinnerVisible}
                setPlayerVisibilityClass={setPlayerVisibilityClass}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                playerVisibilityClass={playerVisibilityClass}
                appUser={appUser}
                setAppUser={setAppUser}
            />
            <Footer
                appUser={appUser}
                setAppUser={setAppUser}
            />
        </>
    );
}

// Export der App-Komponente für die Verwendung in anderen Dateien
export default App;
