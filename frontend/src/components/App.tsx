import '../stylesheets/App.css';
import Header from './Header.tsx';
import List from './List.tsx';
import { useState, useEffect } from 'react';
import axios from 'axios'; // Stelle sicher, dass Axios installiert ist: npm install axios
import RadioStation from '../models/RadioStation.ts';

function App() {
    const [mainList, setMainList] = useState<RadioStation[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/radio');
                // Annahme: Die API-Antwort enthält ein Array von RadioStation-Objekten
                setMainList(response.data);
            } catch (error) {
                console.error('Fehler beim Abrufen der Daten:', error);
            }
        };

        fetchData();
    }, []); // Leerer Dependency Array, um sicherzustellen, dass der Effekt nur einmal bei der Montage aufgerufen wird

    return (
        <>
            <Header />
            <List mainList={mainList} />
        </>
    );
}

export default App;
