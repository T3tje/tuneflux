import {useState} from "react";
import "../stylesheets/ListHeader.css"

type ListHeaderProps = {
    setSearchInput: React.Dispatch<React.SetStateAction<string>>,
    searchInput: string,
    fetchData: (actualSearchInput:string, numberOfStations:number) => void,
    setListAmountNumber: React.Dispatch<React.SetStateAction<number>>;
}

export default function ListHeader(props: Readonly<ListHeaderProps>) {
    const [searchOpen, setSearchOpen] = useState(false)


    const toggleSeachInput = () => {
        setSearchOpen((searchOpen) => !searchOpen)
    }

    const handleSearchInput = (event:React.ChangeEvent<HTMLInputElement>) => {
        props.setSearchInput(event.target.value)
    }

    const handleXButton = () => {
        props.setSearchInput("")
        toggleSeachInput()
        props.fetchData("", 11)
        props.setListAmountNumber(11)
    }

    const handleKeyDown = (event:React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            props.fetchData(props.searchInput, 11);
            props.setListAmountNumber(11)
        }
    }


    return(
        <div id="listHeaderDiv">
            <div id="filterDiv">Filter / Sort</div>
            {
                searchOpen ?

                    <div className="searchInputOuterDiv">
                    <input
                            type="text"
                            onChange={handleSearchInput}
                            value={props.searchInput}
                            placeholder="search station"
                            onKeyDown={handleKeyDown}

                        />
                        <button className="searchInputDelX" onClick={handleXButton}><span>x</span></button>
                    </div> :
                    <button className="lupenButton" onClick={toggleSeachInput}>
                        <img
                            className="lupe" src="../../public/lupeNeu.png" alt="Search Icon"
                        />
                    </button>
            }

        </div>
    )
}