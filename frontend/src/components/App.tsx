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

// Hauptfunktion für die App-Komponente
function App() {
    // Zustände für die App-Komponente
    const [playerVisibilityClass, setPlayerVisibilityClass] = useState<string>("playerNotVisible");
    const [isPlaying, setIsPlaying] = useState(false);
    const [actualStation, setActualStation] = useState<RadioStation>();
    const [mainPlayLoadingSpinnerVisible, setMainPlayLoadingSpinnerVisible] = useState<boolean>(false);
    const [appUser, setAppUser] = useState<AppUser | undefined | null>(undefined)
    const [mainList, setMainList] = useState<RadioStation[]>([]);
    // const [favList, setFavList] = useState<RadioStation[]>([]);
    const [marginListBottom, setMarginListBottom] = useState<string>("");
    const [searchMainListDone, setSearchMainListDone] = useState<boolean>(false);
    // const [searchFavListDone, setSearchFavListDone] = useState<boolean>(false);
    const [listAmountNumber, setListAmountNumber] = useState<number>(20);
    const [searchMainInput, setSearchMainInput] = useState("");

    useEffect(() => {
        functions.getMe(setAppUser);
    }, [])

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
                            listTopic={"All stations"}
                            setActualStation={setActualStation}
                            setIsPlaying={setIsPlaying}
                            actualStation={actualStation}
                            list={mainList}
                            setList={setMainList}
                            marginListBottom={marginListBottom}
                            setMarginListBottom={setMarginListBottom}
                            searchDone={searchMainListDone}
                            setSearchDone={setSearchMainListDone}
                            listAmountNumber={listAmountNumber}
                            setListAmountNumber={setListAmountNumber}
                            searchInput={searchMainInput}
                            setSearchInput={setSearchMainInput}
                            fetchData={functions.fetchData}
                        />}
                />

                {/* FAVORITES → List-Komponente für die Anzeige der Radiostationen */}
                <Route
                    path="/favorites"
                    element={
                        <List
                            listTopic={"Favorites"}
                            setActualStation={setActualStation}
                            setIsPlaying={setIsPlaying}
                            actualStation={actualStation}
                            list={mainList}
                            setList={setMainList}
                            marginListBottom={marginListBottom}
                            setMarginListBottom={setMarginListBottom}
                            searchDone={searchMainListDone}
                            setSearchDone={setSearchMainListDone}
                            listAmountNumber={listAmountNumber}
                            setListAmountNumber={setListAmountNumber}
                            searchInput={searchMainInput}
                            setSearchInput={setSearchMainInput}
                            fetchData={functions.fetchData}
                        />}
                />
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
            />
            {/* Footer */}
            <div id="footer">
            { appUser ? (
                <>
                    <p>{appUser?.name}</p>
                    <button onClick={() => functions.logout(setAppUser)}>logout</button>
                </>
            ):
                <button onClick={functions.login}>login</button>
            }
            </div>

        </>
    );
}

// Export der App-Komponente für die Verwendung in anderen Dateien
export default App;
